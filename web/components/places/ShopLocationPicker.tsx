'use client';

import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import {
    CircleMarker,
    MapContainer,
    TileLayer,
    useMapEvents,
} from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface ShopLocation {
    address: string;
    latitude: number | null;
    longitude: number | null;
}

interface SearchResult {
    display_name: string;
    lat: string;
    lon: string;
    name?: string;
}

const DEFAULT_CENTER: [number, number] = [11.5564, 104.9282];

function LocationClickHandler({
    onSelect,
}: {
    onSelect: (latitude: number, longitude: number) => void;
}) {
    useMapEvents({
        click: (event) => onSelect(event.latlng.lat, event.latlng.lng),
    });
    return null;
}

export default function ShopLocationPicker({
    value,
    onChange,
}: {
    value: ShopLocation;
    onChange: (location: ShopLocation) => void;
}) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(
        'Search for a shop or click the map to place a pin.',
    );

    const selectCoordinates = async (latitude: number, longitude: number) => {
        onChange({ ...value, latitude, longitude });
        setMessage('Finding the address...');

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            );
            if (!response.ok) throw new Error('Address lookup failed');
            const data = await response.json();
            onChange({
                ...value,
                address: data.display_name || '',
                latitude,
                longitude,
            });
            setMessage('Location selected.');
        } catch {
            setMessage('Coordinates selected. Address lookup was unavailable.');
        }
    };

    const search = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setMessage('Searching OpenStreetMap...');
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(query)}`,
            );
            if (!response.ok) throw new Error('Search failed');
            setResults(await response.json());
            setMessage('Choose the matching shop from the results.');
        } catch {
            setMessage(
                'Search is unavailable right now. You can click the map instead.',
            );
        } finally {
            setLoading(false);
        }
    };

    const useCurrentLocation = () => {
        if (!navigator.geolocation) {
            setMessage('Location access is not available in this browser.');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            ({ coords }) =>
                void selectCoordinates(coords.latitude, coords.longitude),
            () =>
                setMessage(
                    'Location access was denied. You can click the map instead.',
                ),
        );
    };

    const center: [number, number] =
        value.latitude !== null && value.longitude !== null
            ? [value.latitude, value.longitude]
            : DEFAULT_CENTER;

    return (
        <section className="space-y-3 rounded-lg border p-4">
            <div>
                <h2 className="font-semibold">Shop location</h2>
                <p className="text-sm text-muted-foreground">
                    Choose the exact place visitors should find.
                </p>
            </div>
            <div className="flex gap-2">
                <Input
                    value={query}
                    placeholder="Search shop name or address"
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') void search();
                    }}
                />
                <Button
                    type="button"
                    onClick={() => void search()}
                    disabled={loading}
                >
                    Search
                </Button>
            </div>
            <div className="flex flex-wrap gap-2">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={useCurrentLocation}
                >
                    Use my location
                </Button>
                {results.map((result) => (
                    <Button
                        type="button"
                        variant="outline"
                        className="h-auto whitespace-normal text-left"
                        key={`${result.lat}-${result.lon}`}
                        onClick={() => {
                            setResults([]);
                            void selectCoordinates(
                                Number(result.lat),
                                Number(result.lon),
                            );
                        }}
                    >
                        {result.display_name}
                    </Button>
                ))}
            </div>
            <div className="h-80 overflow-hidden rounded-md border">
                <MapContainer
                    center={center}
                    zoom={value.latitude === null ? 13 : 17}
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationClickHandler
                        onSelect={(latitude, longitude) =>
                            void selectCoordinates(latitude, longitude)
                        }
                    />
                    {value.latitude !== null && value.longitude !== null && (
                        <CircleMarker
                            center={[value.latitude, value.longitude]}
                            radius={10}
                            pathOptions={{ color: '#dc2626' }}
                        />
                    )}
                </MapContainer>
            </div>
            <p className="text-sm text-muted-foreground">{message}</p>
            {(value.address || value.latitude !== null) && (
                <div className="rounded-md bg-muted p-3 text-sm">
                    <p className="font-medium">Selected shop location</p>
                    {value.address && (
                        <p className="mt-1 text-muted-foreground">
                            {value.address}
                        </p>
                    )}
                    {value.latitude !== null && value.longitude !== null && (
                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                            {value.latitude.toFixed(6)},{' '}
                            {value.longitude.toFixed(6)}
                        </p>
                    )}
                </div>
            )}
        </section>
    );
}
