"use client";

import { useState, useRef, useCallback, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type IconType = "spotify" | "pinterest" | "image";

interface DesktopIcon {
  id: string;
  type: IconType;
  label: string;
  url?: string; // for spotify/pinterest
  imageData?: string; // for image icons (base64)
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
}

interface ImagePreview {
  id: string;
  imageData: string;
  label: string;
}

interface WallpaperCrop {
  imageData: string;
  scale: number;
  x: number;
  y: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Icon SVGs
// ─────────────────────────────────────────────────────────────────────────────

function SpotifyIcon() {
  return (
    <div 
      className="relative w-16 h-16 rounded-[6px] overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1ed760 0%, #1db954 100%)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08), inset 0 0 0 0.5px rgba(0,0,0,0.1)',
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none">
          <path
            d="M17.9 10.9C14.7 9 9.35 8.8 6.3 9.75C5.8 9.9 5.3 9.6 5.15 9.15C5 8.65 5.3 8.15 5.75 8C9.3 6.95 15.15 7.15 18.85 9.35C19.3 9.6 19.45 10.2 19.2 10.65C18.95 11 18.35 11.15 17.9 10.9ZM17.8 13.7C17.55 14.05 17.1 14.2 16.75 13.95C14.05 12.3 9.95 11.8 6.8 12.8C6.4 12.9 5.95 12.7 5.85 12.3C5.75 11.9 5.95 11.45 6.35 11.35C10 10.25 14.5 10.8 17.6 12.7C17.9 12.85 18.05 13.35 17.8 13.7ZM16.6 16.45C16.4 16.75 16.05 16.85 15.75 16.65C13.4 15.2 10.45 14.9 6.95 15.7C6.6 15.8 6.3 15.55 6.2 15.25C6.1 14.9 6.35 14.6 6.65 14.5C10.45 13.65 13.75 14 16.35 15.6C16.7 15.75 16.75 16.15 16.6 16.45Z"
            fill="white"
          />
        </svg>
      </div>
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
        }}
      />
    </div>
  );
}

function PinterestIcon() {
  return (
    <div 
      className="relative w-16 h-16 rounded-[6px] overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #e60023 0%, #c9002b 100%)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08), inset 0 0 0 0.5px rgba(0,0,0,0.1)',
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none">
          <path
            d="M12 5.5C8.41 5.5 5.5 8.41 5.5 12C5.5 14.65 7.08 16.93 9.35 17.97C9.31 17.45 9.27 16.63 9.38 16.05C9.48 15.53 10.03 13.17 10.03 13.17C10.03 13.17 9.87 12.77 9.87 12.17C9.87 11.23 10.42 10.53 11.1 10.53C11.68 10.53 11.96 10.96 11.96 11.48C11.96 12.06 11.59 12.92 11.4 13.71C11.24 14.37 11.73 14.91 12.38 14.91C13.56 14.91 14.46 13.67 14.46 11.89C14.46 10.32 13.33 9.23 11.66 9.23C9.72 9.23 8.59 10.68 8.59 12.18C8.59 12.76 8.81 13.38 9.09 13.72C9.14 13.78 9.15 13.84 9.13 13.9C9.1 14.04 9.02 14.35 9 14.43C8.97 14.54 8.9 14.57 8.79 14.52C7.95 14.13 7.43 12.95 7.43 12.15C7.43 10.11 8.93 8.23 11.84 8.23C14.18 8.23 16 9.91 16 11.86C16 14.17 14.56 16.02 12.55 16.02C11.86 16.02 11.21 15.66 10.98 15.24C10.98 15.24 10.61 16.63 10.53 16.94C10.39 17.49 10.01 18.19 9.75 18.61C10.46 18.83 11.22 18.95 12 18.95C15.59 18.95 18.5 16.04 18.5 12.45C18.5 8.41 15.59 5.5 12 5.5Z"
            fill="white"
          />
        </svg>
      </div>
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
        }}
      />
    </div>
  );
}

function ImageFileIcon({ preview }: { preview?: string }) {
  if (preview) {
    return (
      <div 
        className="relative w-16 h-16 rounded-[6px] overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f7 100%)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08), inset 0 0 0 0.5px rgba(0,0,0,0.08)',
        }}
      >
        {/* Inner border for depth */}
        <div className="absolute inset-[3px] rounded-[4px] overflow-hidden bg-white">
          <img 
            src={preview} 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        {/* Subtle top highlight for glossy effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
          }}
        />
      </div>
    );
  }
  return (
    <div 
      className="relative w-16 h-16 rounded-[6px] overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f7 100%)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08), inset 0 0 0 0.5px rgba(0,0,0,0.08)',
      }}
    >
      <div className="absolute inset-[3px] rounded-[4px] overflow-hidden bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-white/90" fill="currentColor">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        </svg>
      </div>
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
        }}
      />
    </div>
  );
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none">
      <path
        d="M3 6C3 4.89543 3.89543 4 5 4H9.58579C9.851 4 10.1054 4.10536 10.2929 4.29289L12 6H19C20.1046 6 21 6.89543 21 8V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6Z"
        fill="#60A5FA"
      />
      <path d="M3 8H21V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V8Z" fill="#3B82F6" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────────────────

function DesktopIconComponent({
  icon,
  isSelected,
  onSelect,
  onDoubleClick,
  onRemove,
  onDragMove,
}: {
  icon: DesktopIcon;
  isSelected: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
  onRemove: () => void;
  onDragMove: (x: number, y: number) => void;
}) {
  const [isPressed, setIsPressed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, iconX: 0, iconY: 0 });
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    
    // Start drag immediately
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      iconX: icon.x,
      iconY: icon.y,
    });
    onSelect();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    
    const parent = (e.currentTarget as HTMLElement).parentElement;
    if (!parent) return;
    
    const rect = parent.getBoundingClientRect();
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    // Convert pixel delta to percentage
    const deltaXPercent = (deltaX / rect.width) * 100;
    const deltaYPercent = (deltaY / rect.height) * 100;
    
    const newX = Math.max(0, Math.min(95, dragStart.iconX + deltaXPercent));
    const newY = Math.max(0, Math.min(90, dragStart.iconY + deltaYPercent));
    
    onDragMove(newX, newY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    target.releasePointerCapture(e.pointerId);
    setIsDragging(false);
  };

  const handleDoubleClickEvent = (e: React.MouseEvent) => {
    if (isDragging) return;
    e.stopPropagation();
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 250);
    onDoubleClick();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove();
  };

  return (
    <div
      className={`
        absolute desktop-icon flex flex-col items-center gap-1 p-2 select-none
        rounded-lg touch-none
        ${isDragging ? "cursor-grabbing z-50" : "cursor-grab"}
        ${isSelected ? "bg-white/15" : "hover:bg-white/8"}
        ${isPressed ? "icon-press" : ""}
      `}
      style={{
        left: `${icon.x}%`,
        top: `${icon.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={handleDoubleClickEvent}
      onContextMenu={handleContextMenu}
    >
      <div className="pointer-events-none" style={{
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))'
      }}>
        {icon.type === "spotify" && <SpotifyIcon />}
        {icon.type === "pinterest" && <PinterestIcon />}
        {icon.type === "image" && <ImageFileIcon preview={icon.imageData} />}
      </div>
      <span
        className={`
          text-[11px] text-center leading-tight max-w-[80px] truncate pointer-events-none
          ${isSelected ? "bg-[#0058d1] text-white px-1.5 py-0.5 rounded" : "text-white/95"}
        `}
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
          fontWeight: 400,
          textShadow: isSelected ? 'none' : '0 1px 2px rgba(0,0,0,0.5)',
        }}
      >
        {icon.label}
      </span>
    </div>
  );
}

function ImagePreviewWindow({
  preview,
  onClose,
}: {
  preview: ImagePreview;
  onClose: () => void;
}) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 180);
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className={`
          bg-[#232323] rounded-xl overflow-hidden max-w-[80%] max-h-[80%]
          shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.1)]
          ${isClosing ? "window-close" : "window-open"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Window title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-b from-[#3d3d3d] to-[#2d2d2d] border-b border-black/30">
          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 flex items-center justify-center group transition-all"
            >
              <svg className="w-1.5 h-1.5 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10" fill="none">
                <path d="M1 1L9 9M9 1L1 9" stroke="rgba(0,0,0,0.5)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-[13px] text-white/70 ml-3 truncate font-medium">{preview.label}</span>
        </div>
        {/* Image content */}
        <div className="bg-[#1a1a1a]">
          <img
            src={preview.imageData}
            alt={preview.label}
            className="max-w-full max-h-[60vh] object-contain"
          />
        </div>
      </div>
    </div>
  );
}

function AddIconPanel({
  onAddIcon,
  onUploadWallpaper,
}: {
  onAddIcon: (type: IconType, url?: string, imageData?: string, label?: string) => void;
  onUploadWallpaper: (imageData: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [pinterestUrl, setPinterestUrl] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const wallpaperInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const imageData = ev.target?.result as string;
        onAddIcon("image", undefined, imageData, file.name);
      };
      reader.readAsDataURL(file);
    }
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        // Pass the raw image data to trigger crop modal
        onUploadWallpaper(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    if (wallpaperInputRef.current) wallpaperInputRef.current.value = "";
  };

  return (
    <div className="absolute top-4 right-4 z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-10 h-10 rounded-full glass bg-black/40 border border-white/20 
          flex items-center justify-center text-white/80 hover:text-white
          hover:bg-black/60 hover:border-white/30 hover:scale-105
          active:scale-95 transition-all duration-150
          ${isOpen ? "rotate-45" : ""}
        `}
      >
        <svg className="w-5 h-5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 bg-[#2d2d2d]/90 glass rounded-xl 
                        border border-white/10 shadow-2xl overflow-hidden min-w-[240px] panel-open">
          <div className="p-3 border-b border-white/10">
            <span className="text-xs text-white/50 uppercase tracking-wider">Add to Desktop</span>
          </div>

          {/* Wallpaper */}
          <button
            onClick={() => wallpaperInputRef.current?.click()}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm text-white">Change Wallpaper</span>
          </button>
          <input
            ref={wallpaperInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleWallpaperUpload}
          />

          <div className="h-px bg-white/10" />

          {/* Spotify */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-3 mb-2">
              <SpotifyIcon />
              <span className="text-sm text-white">Spotify</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="open.spotify.com/user/..."
                value={spotifyUrl}
                onChange={(e) => setSpotifyUrl(e.target.value)}
                className="flex-1 px-2 py-1 text-xs bg-black/30 border border-white/10 rounded text-white placeholder:text-white/30"
              />
              <button
                onClick={() => {
                  if (spotifyUrl) {
                    onAddIcon("spotify", spotifyUrl);
                    setSpotifyUrl("");
                  }
                }}
                className="px-2 py-1 text-xs bg-[#1DB954] rounded text-white hover:bg-[#1DB954]/80"
              >
                Add
              </button>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          {/* Pinterest */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-3 mb-2">
              <PinterestIcon />
              <span className="text-sm text-white">Pinterest</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="pinterest.com/username"
                value={pinterestUrl}
                onChange={(e) => setPinterestUrl(e.target.value)}
                className="flex-1 px-2 py-1 text-xs bg-black/30 border border-white/10 rounded text-white placeholder:text-white/30"
              />
              <button
                onClick={() => {
                  if (pinterestUrl) {
                    onAddIcon("pinterest", pinterestUrl);
                    setPinterestUrl("");
                  }
                }}
                className="px-2 py-1 text-xs bg-[#E60023] rounded text-white hover:bg-[#E60023]/80"
              >
                Add
              </button>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          {/* Image */}
          <button
            onClick={() => imageInputRef.current?.click()}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors"
          >
            <ImageFileIcon />
            <span className="text-sm text-white">Add Image</span>
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

          <div className="p-3 border-t border-white/10 bg-black/20">
            <span className="text-[10px] text-white/40">Right-click icons to remove</span>
          </div>
        </div>
      )}
    </div>
  );
}

function WallpaperCropModal({
  imageData,
  onConfirm,
  onCancel,
}: {
  imageData: string;
  onConfirm: (crop: WallpaperCrop) => void;
  onCancel: () => void;
}) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const minScale = 1;
  const maxScale = 3;

  const clampPosition = useCallback(
    (nextX: number, nextY: number, nextScale = scale) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { x: nextX, y: nextY };
      const maxX = Math.max(0, (nextScale - 1) * rect.width * 0.5);
      const maxY = Math.max(0, (nextScale - 1) * rect.height * 0.5);
      return {
        x: Math.min(maxX, Math.max(-maxX, nextX)),
        y: Math.min(maxY, Math.max(-maxY, nextY)),
      };
    },
    [scale]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === imageRef.current || (e.target as HTMLElement).closest('img')) {
      setIsDragging(true);
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setDragStart({
          x: e.clientX - position.x - rect.left,
          y: e.clientY - position.y - rect.top,
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nextX = e.clientX - rect.left - dragStart.x;
    const nextY = e.clientY - rect.top - dragStart.y;
    setPosition(clampPosition(nextX, nextY));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => {
      const nextScale = Math.max(minScale, Math.min(maxScale, prev * delta));
      setPosition((current) => clampPosition(current.x, current.y, nextScale));
      return nextScale;
    });
  };

  const handleConfirm = () => {
    // Store position as percentage offset from center for better scaling
    const containerWidth = containerRef.current?.clientWidth || 800;
    const containerHeight = containerRef.current?.clientHeight || 500;
    const normalizedX = (position.x / containerWidth) * 100;
    const normalizedY = (position.y / containerHeight) * 100;
    
    onConfirm({
      imageData,
      scale,
      x: normalizedX,
      y: normalizedY,
    });
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const nextX = e.clientX - rect.left - dragStart.x;
      const nextY = e.clientY - rect.top - dragStart.y;
      setPosition(clampPosition(nextX, nextY));
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragStart, clampPosition]);

  return (
    <div
      className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="bg-[#232323] rounded-xl overflow-hidden shadow-2xl max-w-4xl w-full window-open">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-[#3d3d3d] to-[#2d2d2d] border-b border-black/30">
          <h2 className="text-white font-medium">Position & Resize Wallpaper</h2>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-1.5 text-sm text-white/70 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Crop Area - 19.5:9 aspect ratio */}
        <div
          ref={containerRef}
          className="relative bg-[#1a1a1a] overflow-hidden cursor-move"
          style={{ aspectRatio: '19.5/9', maxWidth: '90vw', maxHeight: '60vh' }}
          onMouseMove={handleMouseMove}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
        >
          {/* 16:10 Frame Overlay */}
          <div className="absolute inset-0 border-2 border-white/30 pointer-events-none" />
          <div className="absolute inset-0 border-4 border-dashed border-white/10 pointer-events-none" />

          {/* Image Container */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
            }}
          >
            <img
              ref={imageRef}
              src={imageData}
              alt="Wallpaper preview"
              className="select-none"
              style={{
                width: `${scale * 100}%`,
                height: `${scale * 100}%`,
                objectFit: 'cover',
              }}
              draggable={false}
            />
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg text-white/70 text-xs text-center">
            Drag to move • Scroll to zoom • Click Apply when ready
          </div>
        </div>

        {/* Controls */}
        <div className="px-6 py-4 bg-[#2d2d2d] border-t border-black/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="text-white/70 text-sm">Zoom:</label>
            <input
              type="range"
              min={minScale}
              max={maxScale}
              step="0.1"
              value={scale}
              onChange={(e) => {
                const nextScale = parseFloat(e.target.value);
                setScale(nextScale);
                setPosition((current) => clampPosition(current.x, current.y, nextScale));
              }}
              className="w-32"
            />
            <span className="text-white/50 text-sm w-12">{Math.round(scale * 100)}%</span>
          </div>
          <button
            onClick={() => {
              setScale(1);
              setPosition({ x: 0, y: 0 });
            }}
            className="px-3 py-1.5 text-xs text-white/70 hover:text-white transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function RotateHint() {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] flex flex-col items-center justify-center gap-6 z-[200] portrait:flex landscape:hidden">
      <div className="relative">
        <div className="w-24 h-16 border-3 border-white/40 rounded-xl flex items-center justify-center">
          <svg className="w-12 h-12 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <svg className="w-8 h-8 text-white/60 absolute animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      </div>
      <div className="text-center px-8">
        <p className="text-white/80 text-base font-semibold">Please rotate your device</p>
        <p className="text-white/50 text-sm mt-2">This experience is designed for landscape mode</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function DemoPage() {
  const [wallpaper, setWallpaper] = useState<string | null>(null);
  const [wallpaperCrop, setWallpaperCrop] = useState<WallpaperCrop | null>(null);
  const [pendingWallpaper, setPendingWallpaper] = useState<string | null>(null);
  const [icons, setIcons] = useState<DesktopIcon[]>([]);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<ImagePreview | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 1920, height: 1080 });

  // Generate random position with basic overlap avoidance
  const findNextPosition = useCallback(() => {
    const maxAttempts = 50;
    const iconSize = 10; // approximate icon size in percentage
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Random position within canvas bounds (leaving margins)
      const x = 10 + Math.random() * 75;
      const y = 10 + Math.random() * 75;
      
      // Check if too close to existing icons
      const tooClose = icons.some((icon) => {
        const dx = Math.abs(icon.x - x);
        const dy = Math.abs(icon.y - y);
        return dx < iconSize && dy < iconSize;
      });
      
      if (!tooClose) {
        return { x, y };
      }
    }
    
    // Fallback to random if we can't find a good spot
    return { x: 10 + Math.random() * 75, y: 10 + Math.random() * 75 };
  }, [icons]);

  const handleAddIcon = useCallback(
    (type: IconType, url?: string, imageData?: string, label?: string) => {
      const pos = findNextPosition();
      const newIcon: DesktopIcon = {
        id: `${type}-${Date.now()}`,
        type,
        label: label || (type === "spotify" ? "Spotify" : type === "pinterest" ? "Pinterest" : "Image"),
        url,
        imageData,
        ...pos,
      };
      setIcons((prev) => [...prev, newIcon]);
    },
    [findNextPosition]
  );

  const handleRemoveIcon = useCallback((id: string) => {
    setIcons((prev) => prev.filter((i) => i.id !== id));
    if (selectedIconId === id) setSelectedIconId(null);
  }, [selectedIconId]);

  const handleIconDoubleClick = useCallback((icon: DesktopIcon) => {
    if (icon.type === "image" && icon.imageData) {
      setImagePreview({ id: icon.id, imageData: icon.imageData, label: icon.label });
    } else if (icon.url) {
      // Ensure URL has protocol
      let url = icon.url;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }, []);

  const handleDesktopClick = useCallback(() => {
    setSelectedIconId(null);
  }, []);

  const handleWallpaperUpload = useCallback((imageData: string) => {
    setPendingWallpaper(imageData);
  }, []);

  const handleWallpaperConfirm = useCallback((crop: WallpaperCrop) => {
    setWallpaperCrop(crop);
    setWallpaper(crop.imageData);
    setPendingWallpaper(null);
  }, []);

  const handleWallpaperCancel = useCallback(() => {
    setPendingWallpaper(null);
  }, []);

  useEffect(() => {
    const updateViewport = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  return (
    <>
      <RotateHint />
      
      {/* Full-screen wallpaper - scales with viewport */}
      {wallpaper && wallpaperCrop && (
        <div className="fixed inset-0 z-0 overflow-hidden bg-black">
          <img
            src={wallpaper}
            alt="Wallpaper"
            className="w-full h-full object-cover"
            style={{
              objectPosition: `${50 + wallpaperCrop.x}% ${50 + wallpaperCrop.y}%`,
              transform: `scale(${wallpaperCrop.scale})`,
              transformOrigin: 'center center',
            }}
          />
        </div>
      )}
      
      <div className="min-h-screen w-full flex items-center justify-center relative z-10 overflow-hidden">
        {/* Desktop Canvas - 19.5:9 aspect ratio (phone landscape) */}
        <div
          className={`relative w-full h-full overflow-hidden ${wallpaper ? "bg-transparent" : "bg-[#1c1c1e]"}`}
          style={{ 
            aspectRatio: '19.5/9',
            maxWidth: '100vw',
            maxHeight: '100vh'
          }}
          onClick={handleDesktopClick}
        >
          {/* Desktop background (only shows if no wallpaper) */}
          {!wallpaper && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]" />
          )}

          {/* Desktop Icons - Absolute Positioning */}
          <div className="absolute inset-0">
            {icons.map((icon) => (
              <DesktopIconComponent
                key={icon.id}
                icon={icon}
                isSelected={selectedIconId === icon.id}
                onSelect={() => setSelectedIconId(icon.id)}
                onDoubleClick={() => handleIconDoubleClick(icon)}
                onRemove={() => handleRemoveIcon(icon.id)}
                onDragMove={(x, y) => {
                  setIcons((prev) =>
                    prev.map((i) => (i.id === icon.id ? { ...i, x, y } : i))
                  );
                }}
              />
            ))}
          </div>

          {/* Add Icon Panel */}
          <AddIconPanel onAddIcon={handleAddIcon} onUploadWallpaper={handleWallpaperUpload} />

          {/* Image Preview Window */}
          {imagePreview && (
            <ImagePreviewWindow
              preview={imagePreview}
              onClose={() => setImagePreview(null)}
            />
          )}

          {/* Wallpaper Crop Modal */}
          {pendingWallpaper && (
            <WallpaperCropModal
              imageData={pendingWallpaper}
              onConfirm={handleWallpaperConfirm}
              onCancel={handleWallpaperCancel}
            />
          )}

          {/* Empty state hint */}
          {icons.length === 0 && !wallpaper && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="flex justify-center mb-4 opacity-30">
                  <FolderIcon />
                </div>
                <p className="text-white/40 text-sm font-medium">Your desktop is empty</p>
                <p className="text-white/25 text-xs mt-1">Click + to add icons and wallpaper</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
