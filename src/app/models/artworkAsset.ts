export class ArtworkAsset {
    id: number;
    ArtworkId: number;
    description: string;
    title: string;
    assetType: number;
    address: string;
    visible: boolean;
    approved: boolean;
    approvedDate?: string;
    approvedBy?: number;
    autoPlay?: boolean;
    onlyInHeadphone?: boolean;
    longDescription?: string;
}
