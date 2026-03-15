"use client";

import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

export default function MapEmbedded() {
    // Rambhadrapur, Darbhanga, Bihar coordinates approximately
    const position = [26.1132, 85.9221];

    useEffect(() => {
        // Fix for default marker icons in react-leaflet not showing up
        const L = require('leaflet');
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
            iconUrl: require('leaflet/dist/images/marker-icon.png').default,
            shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
        });
    }, []);

    return (
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }}>
            <TileLayer
                attribution='&amp;copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
                <Popup>
                    AC &amp; DC Technical Institute <br /> Rambhadrapur, Darbhanga, Bihar.
                </Popup>
            </Marker>
        </MapContainer>
    );
}
