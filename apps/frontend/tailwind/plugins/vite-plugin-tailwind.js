import { generateStyles } from "../src/tailwind-engine";

// https://cn.vitejs.dev/guide/api-plugin.html#transformindexhtml
const allClassName = new Set();
const vueClassRegex = /class:\s*["']([^"']+)["']/g
const regex = /class:\s*["'](.*?)["']/g;
export function miracleTailwindPlugin(){
    // plugin protocol
    return {
        name: 'vite-plugin-tailwind',
        //
        enforce: 'post',
        //
        transform(code ,id){
          //  console.log(code,id)
            // collect class names from code.
            //console.log('start==',id)
            if (/\.(vue|html|svelte|jsx|tsx)$/.test(id)){

                console.log(id)
                 let match = vueClassRegex.exec(code);

                 while (match !== null) {
                    console.log(match[1]); // 输出捕获组中的内容，即类名
                    match[1].split(' ').forEach(item => allClassName.add(item)); //  /\s+/ 


                    match = vueClassRegex.exec(code);
                }


/*                     const matches = code.matchAll(regex);
                    for (const match of matches) {
                        console.log(match[1]); // 输出捕获组中的内容，即类名
                    } */
            }

            return code;
        },
        // generate HTML content
        transformIndexHtml(html, ctx){
            //transfer class names to  html.

          //  console.log(html, ctx)

            console.log(allClassName)


            const finalCSS = generateStyles(allClassName)

            console.log('finalCSS',finalCSS)


            // const style = `<style type="text/css" id='miracle-tailwind-style'>${finalCSS}</style>`;

           // const head = ctx.head.replace(/<\/head>/, `${style}\n</head>`);

           // return html;

           return [
            {
                tag:'style',
                attrs:{ type:'text/css' ,id : 'miracle-tailwind-style'},
                children: finalCSS,
                injectTo:'head-prepend'
            }
           ]
            
        }

    }
}