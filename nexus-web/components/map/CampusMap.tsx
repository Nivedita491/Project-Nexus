"use client";

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface Place {
    id: string;
    name: string;
    lat: number;
    lng: number;
    description: string;
}

interface CampusMapProps {
    places: Place[];
    onMarkerClick: (place: Place) => void;
}

export function CampusMap({ places, onMarkerClick }: CampusMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);

    useEffect(() => {
        const initMap = async () => {
            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
                version: "weekly",
            });

            await (loader as any).importLibrary("maps");
            await (loader as any).importLibrary("marker");

            if (mapRef.current && !mapInstanceRef.current) {
                mapInstanceRef.current = new google.maps.Map(mapRef.current, {
                    center: { lat: 30.767, lng: 76.575 },
                    zoom: 16,
                    disableDefaultUI: false,
                    zoomControl: true,
                    mapId: "DEMO_MAP_ID" // Required for Advanced Markers if we used them, but good practice
                });
            }
        };

        initMap();
    }, []);

    useEffect(() => {
        if (!mapInstanceRef.current) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // Add new markers
        places.forEach((place) => {
            const marker = new google.maps.Marker({
                position: { lat: place.lat, lng: place.lng },
                map: mapInstanceRef.current,
                title: place.name,
                animation: google.maps.Animation.DROP,
            });

            marker.addListener("click", () => {
                onMarkerClick(place);
            });

            markersRef.current.push(marker);
        });
    }, [places]);

    return <div ref={mapRef} className="h-full w-full rounded-xl shadow-inner bg-gray-100" />;
}
