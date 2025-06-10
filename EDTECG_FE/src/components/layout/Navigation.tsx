// src/main/frontend/src/components/layout/Navigation.tsx
import React, { useState } from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    IconButton,
    useTheme,
    useMediaQuery,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
} from '@mui/material';
import {
    Menu as MenuIcon,
    School as SchoolIcon,
    Home as HomeIcon,
    Collections as CollectionsIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navigation = () => {
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const menuItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/' },

    ];

    const renderDrawerContent = () => (
        <Box sx={{ width: 250 }}>
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => {
                                navigate(item.path);
                                setMobileOpen(false);
                            }}
                        >
                            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: theme.zIndex.drawer + 1,
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    boxShadow: 1,
                }}
            >
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            '&:hover': { opacity: 0.8 }
                        }}
                        onClick={() => navigate('/')}
                    >
                        <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                fontWeight: 600,
                                letterSpacing: 0.5
                            }}
                        >
                            EDTECH
                        </Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />

                    {!isMobile && (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {menuItems.map((item) => {
                                const selected = location.pathname === item.path;
                                return (
                                    <Button
                                        key={item.text}
                                        component={Link}
                                        to={item.path}
                                        startIcon={item.icon}
                                        color={selected ? 'primary' : 'inherit'}
                                        variant={selected ? 'contained' : 'text'}
                                        sx={{
                                            textTransform: 'none',
                                            '&:hover': {
                                                backgroundColor: selected
                                                    ? theme.palette.primary.dark
                                                    : theme.palette.action.hover
                                            }
                                        }}
                                    >
                                        {item.text}
                                    </Button>
                                );
                            })}
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            {isMobile && (
                <Drawer
                    variant="temporary"
                    anchor="left"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{
                        keepMounted: true, // Better mobile performance
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: 250,
                            mt: '64px', // Height of AppBar
                        },
                    }}
                >
                    {renderDrawerContent()}
                </Drawer>
            )}

            <Toolbar /> {/* Spacing to prevent content from going under AppBar */}
        </>
    );
};

export default Navigation;