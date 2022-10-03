import { ArtworkAsset } from "./artworkAsset";

export class Artwork {
    id: number;
    title: string;
    description: string;
    artType: string;
    moreInfo: string;
    approved: boolean;
    approvedDate?: string;
    ExhibitId?: number;
    UserId?: number;
    exhibitName?: string;
    assetCount?: number;
    ArtworkAssets?: ArtworkAsset[];
    longDescription?: string;
    approvedBy?: number;
    visible?: boolean;

}
