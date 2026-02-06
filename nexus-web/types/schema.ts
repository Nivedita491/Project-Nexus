export interface LostItem {
    id: string;
    title: string;
    image_url: string;
    created_at: string;
}

export interface Listing {
    id: string;
    title: string;
    price: number;
    image_url: string;
}

export interface Trip {
    id: string;
    origin: string;
    destination: string;
    seats: number;
}
