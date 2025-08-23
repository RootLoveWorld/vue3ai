// 1. define the mapping from class names to styles
const utilities = {
    'bg-purple':{
        'background-color':'purple',
    },
    'text-white':{
        'color':'white',
    },
    'p-2':{
        'padding':'1rem'
    },
    
}

// 2. define the function to generate the styles

export function generateStyles(classNames){
    const styles = {};
    let finalCss = '';
    for(const className of classNames){
        if(utilities[className]){

           // Object.assign(styles,utilities[className]);

            finalCss += `.${className} {
                ${Object.keys(utilities[className]).map(key => `${key}:${utilities[className][key]}`).join(';')}
            }`;
            // ${Object.keys(styles).map(key => `${key}:${styles[key]}`).join(';')}
            finalCss += '\n\n';

        }
    }
    return finalCss;
  //  return styles;
}
