import React from 'react';

const Skeleton = ({ className = '', variant = 'rect', ...props }) => {
    const baseClasses = 'animate-pulse bg-slate-200 dark:bg-slate-800';

    const variants = {
        circle: 'rounded-full',
        rect: 'rounded-md',
        text: 'rounded h-4 w-full mb-2',
    };

    return (
        <div
            className={`${baseClasses} ${variants[variant] || variants.rect} ${className}`}
            {...props}
        />
    );
};

export const PostSkeleton = () => (
    <div className="glass-surface overflow-hidden rounded-2xl mb-5">
        <div className="flex items-center gap-3 p-4">
            <Skeleton variant="circle" className="h-10 w-10 shrink-0" />
            <div className="flex-1">
                <Skeleton variant="text" className="w-24 h-4" />
                <Skeleton variant="text" className="w-16 h-3" />
            </div>
        </div>
        <Skeleton className="aspect-square w-full" />
        <div className="flex gap-3 px-4 pt-3 pb-4">
            <Skeleton variant="circle" className="h-9 w-9" />
            <Skeleton variant="circle" className="h-9 w-9" />
        </div>
        <div className="px-4 pb-5">
            <Skeleton variant="text" className="w-3/4" />
            <Skeleton variant="text" className="w-1/2" />
        </div>
    </div>
);

export default Skeleton;
