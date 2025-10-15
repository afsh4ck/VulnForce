
'use client';
import { useState, useCallback, RefObject } from 'react';

export const useSelectionToolbar = (textareaRef: RefObject<HTMLTextAreaElement>) => {
    const [toolbarState, setToolbarState] = useState({
        visible: false,
        top: 0,
        left: 0,
    });

    const handleSelectionChange = useCallback(() => {
        if (!textareaRef.current) return;

        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const containerRect = textareaRef.current.getBoundingClientRect();

            setToolbarState({
                visible: true,
                top: rect.top - containerRect.top - 40, // Position above selection
                left: rect.left - containerRect.left + rect.width / 2,
            });
        } else {
            setToolbarState(prevState => ({ ...prevState, visible: false }));
        }
    }, [textareaRef]);

    const toolbarStyles: { [key: string]: React.CSSProperties } = {
        toolbar: {
            position: 'absolute',
            top: `${toolbarState.top}px`,
            left: `${toolbarState.left}px`,
            transform: 'translateX(-50%)',
            visibility: toolbarState.visible ? 'visible' : 'hidden',
            opacity: toolbarState.visible ? 1 : 0,
            transition: 'opacity 0.2s, visibility 0.2s',
            zIndex: 50,
        },
        button: {
            padding: '4px 8px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
        }
    };
    
    return { toolbarStyles, handleSelectionChange };
};

