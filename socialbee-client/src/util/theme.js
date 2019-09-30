export default {
    // created using color tool https://material-ui.com/customization/color/
    palette: {
        primary: {
            light: '#d05ce3',
                main: '#9c27b0',
                dark: '#6a0080',
                contrastText: '#fff',
        },
        secondary: {
            light: '#b47cff',
                main: '#7c4dff',
                dark: '#3f1dcb',
                contrastText: '#fff',
        },
    },

    mainTheme: {
        typography: {
            useNextVariants: true
        },
        form: {
            textAlign: 'center'
        },
        image: {
            zoom: '40%',
                margin: '20px auto 20px auto'
        },
        pageTitle: {
            margin: '10px auto 10px auto'
        },
        textField: {
            margin: '10px auto 10px auto'
        },
        button: {
            marginTop: 20,
                position: 'relative'
        },
        customError: {
            color: 'red',
                fontSize: '0.8rem',
                marginTop: 10
        },
        progress: {
            position: 'absolute'
        },
        invisibleSeparator: {
            border: 'none',
            margin: 4
        },
        visibleSeparator: {
            width: '100%',
            borderBottom: '1px solid rbga(0,0,0,0.1)',
            marginBottom: 20
        }
    },

    profileTheme: {
        paper: {
            padding: 20
        },
        profile: {
            '& .image-wrapper': {
                textAlign: 'center',
                position: 'relative',
                '& button': {
                    position: 'absolute',
                    top: '80%',
                    left: '70%'
                }
            },
            '& .profile-image': {
                width: 200,
                height: 200,
                objectFit: 'cover',
                maxWidth: '100%',
                borderRadius: '50%'
            },
            '& .profile-details': {
                textAlign: 'center',
                '& span, svg': {
                    verticalAlign: 'middle'
                },
                '& a': {
                    color: 'palette.primary.main'
                }
            },
            '& hr': {
                border: 'none',
                margin: '0 0 10px 0'
            },
            '& svg.button': {
                '&:hover': {
                    cursor: 'pointer'
                }
            }
        },
        buttons: {
            textAlign: 'center',
            '& a': {
                margin: '20px 10px'
            }
        }
    }
}
