'use client';

import Image, { ImageProps } from 'next/image';
import { CSSProperties, useLayoutEffect, useRef, useState } from 'react';

export default function SmartImage({ src, alt, onClick, containerStyle, ...restProps }: ImageProps & { containerStyle?: CSSProperties }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [cursor, setCursor] = useState<'pointer' | 'auto'>('auto'); // 动态光标

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        const img = imgRef.current;
        if (!canvas || !img) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 获取该点的颜色数据
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const alpha = pixel[3]; // alpha 值 (0 = 完全透明)

        if (alpha > 0) {
            // @ts-expect-error dont mind!
            onClick?.(e)
        }
    };

    // 鼠标移动：检测是否在不透明区域
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const isOpaque = pixel[3] > 0; // alpha > 0 表示不透明
        setCursor(isOpaque ? 'pointer' : 'auto');
    };
    // 鼠标离开：恢复默认
    const handleMouseLeave = () => {
        setCursor('auto');
    };

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        const img = imgRef.current;
        if (!canvas || !img) return;

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.style.width = `${img.width}px`
        canvas.style.height = `${img.width}px`
        console.log({ width: { natural: img.naturalWidth, client: img.clientWidth, offset: img.offsetWidth, width: img.width } })
        console.log({ height: { natural: img.naturalHeight, client: img.clientHeight, offset: img.offsetHeight, width: img.height } })

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(img, 0, 0);
        }
    }, [])

    return (
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', ...containerStyle }}>
            {/* 实际显示的图片 */}
            <Image
                ref={imgRef}
                src={src}
                alt={alt}
                {...restProps}
            />

            {/* 用于事件检测的透明 canvas */}
            {(
                <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        cursor: cursor, // 🔴 动态光标
                        pointerEvents: 'auto',
                        opacity: 1
                    }}
                />
            )}
        </div>
    );
}
