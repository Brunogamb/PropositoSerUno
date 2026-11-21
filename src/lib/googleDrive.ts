import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

function getAuth() {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL || import.meta.env.GOOGLE_CLIENT_EMAIL;
    const rawKey = process.env.GOOGLE_PRIVATE_KEY || import.meta.env.GOOGLE_PRIVATE_KEY;
    const privateKey = rawKey?.replace(/^"|"$/g, '').replace(/\\n/g, '\n');

    if (!clientEmail || !privateKey) {
        throw new Error('Faltan GOOGLE_CLIENT_EMAIL o GOOGLE_PRIVATE_KEY en las variables de entorno');
    }

    return new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: SCOPES,
    });
}

export async function getDriveAccessToken(): Promise<string> {
    const auth = getAuth();
    const { token } = await auth.getAccessToken();
    if (!token) throw new Error('No se pudo generar el token de Google Drive');
    return token;
}

export interface DriveItem {
    id: string;
    name: string;
    mimeType: string;
    size?: string;
    isFolder: boolean;
    children?: DriveItem[];
}

const treeCache = new Map<string, { data: DriveItem[]; expiresAt: number }>();

export async function getFolderTree(
    folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || import.meta.env.GOOGLE_DRIVE_FOLDER_ID
): Promise<DriveItem[]> {
    if (!folderId) throw new Error('Falta GOOGLE_DRIVE_FOLDER_ID');

    const now = Date.now();
    const cached = treeCache.get(folderId);
    if (cached && now < cached.expiresAt) {
        return cached.data;
    }

    const auth = getAuth();
    const drive = google.drive({ version: 'v3', auth });

    const res = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType, size)',
        orderBy: 'folder, name',
        pageSize: 100,
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
    });

    const files = res.data.files || [];
    const tree: DriveItem[] = await Promise.all(
        files.map(async (file) => {
            const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
            const item: DriveItem = {
                id: file.id!,
                name: file.name!,
                mimeType: file.mimeType!,
                size: file.size || undefined,
                isFolder,
            };

            if (isFolder) {
                item.children = await getFolderTree(file.id!);
            }

            return item;
        })
    );

    treeCache.set(folderId, { data: tree, expiresAt: now + 5 * 60 * 1000 });
    return tree;
}

export { getDriveAccessToken as getTemporaryAccessToken };