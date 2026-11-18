import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

function getAuth() {
    const clientEmail = import.meta.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = import.meta.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!clientEmail || !privateKey) {
        throw new Error('Faltan GOOGLE_CLIENT_EMAIL o GOOGLE_PRIVATE_KEY en el .env');
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

export async function getFolderTree(folderId = import.meta.env.GOOGLE_DRIVE_FOLDER_ID): Promise<DriveItem[]> {
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
    const tree: DriveItem[] = [];

    for (const file of files) {
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

        tree.push(item);
    }

    return tree;
}