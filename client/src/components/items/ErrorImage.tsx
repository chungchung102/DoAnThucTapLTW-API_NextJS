'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getFullImageUrl } from '@/api/contentApi';

interface ErrorImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export default function ErrorImage({
    src,
    alt,
    width,
    height,
    fill,
    className,
    style
}: ErrorImageProps) {
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
        }
    };

    // Nếu không có src ban đầu hoặc đã có lỗi, hiển thị placeholder
    const imageSrc = !src || src.trim() === '' || hasError
        ? '/placeholder-image.svg'
        : getFullImageUrl(src);

    const imageProps: {
        src: string;
        alt: string;
        className?: string;
        style?: React.CSSProperties;
        onError: () => void;
        fill?: boolean;
        width?: number;
        height?: number;
    } = {
        src: imageSrc,
        alt: alt || 'Product image',
        className: className,
        style: style,
        onError: handleError,
    };

    if (fill) {
        imageProps.fill = true;
    } else {
        imageProps.width = width || 100;
        imageProps.height = height || 100;
    }

    return <Image {...imageProps} />;
}

// Component placeholder đơn giản khi không có ảnh
export function PlaceholderImage({
    width = 100,
    height = 100,
    className = '',
    style = {}
}: {
    width?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
}) {
    return (
        <div
            className={`d-flex align-items-center justify-content-center bg-light rounded ${className}`}
            style={{ width: `${width}px`, height: `${height}px`, ...style }}
        >
            <i className="fas fa-image text-muted" style={{ fontSize: '24px' }}></i>
        </div>
    );
}
