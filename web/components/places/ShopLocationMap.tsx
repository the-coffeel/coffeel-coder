'use client';

import 'leaflet/dist/leaflet.css';
import {
    CircleMarker,
    MapContainer,
    Popup,
    TileLayer,
    Tooltip,
} from 'react-leaflet';

export default function ShopLocationMap({
    latitude,
    longitude,
    title,
}: {
    latitude: number;
    longitude: number;
    title: string;
}) {
    return (
        <div className="h-72 overflow-hidden rounded-md border">
            <MapContainer
                center={[latitude, longitude]}
                zoom={17}
                scrollWheelZoom={false}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <CircleMarker
                    center={[latitude, longitude]}
                    radius={10}
                    pathOptions={{ color: '#dc2626', fillColor: '#dc2626' }}
                >
                    <Tooltip>{title}</Tooltip>
                    <Popup>{title}</Popup>
                </CircleMarker>
            </MapContainer>
        </div>
    );
}
