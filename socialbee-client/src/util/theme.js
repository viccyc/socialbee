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

    // spread this object
    spreadTheme: {
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
        }
    }
}
