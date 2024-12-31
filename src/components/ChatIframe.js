import React from 'react';
import { Box, Fade } from '@mui/material';

const ChatIframe = ({ isVisible }) => {
    return (
        <Fade in={isVisible} timeout={500}>
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '2%',
                    width: '50%',
                    height: '70%',
                    border: 'none',
                    borderRadius: '10px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    zIndex: 9999,
                    visibility: isVisible ? 'visible' : 'hidden',
                }}
            >
                <iframe
                    width="100%"
                    height="100%"
                    allow="microphone *"
                    src="https://www.gptbots.ai/widget/eehvp2mok0r8pzquaqehwoq/chat.html"
                    title="Chat Widget"
                    style={{
                        border: 'none',
                        borderRadius: '10px',
                        height: '100%',
                        width: '100%',
                    }}
                />
            </Box>
        </Fade>
    );
};

export default ChatIframe; 