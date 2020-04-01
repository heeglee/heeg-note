const styles = theme => ({
    listItem: {
        cursor: 'pointer',
        minHeight: '75px'
    },
    textSection: {
        maxWidth: '85%'
    },  
    deleteIcon: {
        position: 'absolute',
        right: '5px',
        margin: '3px auto',
        top: 'calc(50% - 15px)',
        '&:hover': {
            color: 'red'
        }
    },
    orderUpIcon: {
        position: 'absolute',
        right: '5px',
        top: '5px',
        '&:hover': {
            color: 'gray'
        }
    },
    orderDownIcon: {
        position: 'absolute',
        right: '5px',
        bottom: '5px',
        '&:hover': {
            color: 'gray'
        }
    }
});
  
export default styles;