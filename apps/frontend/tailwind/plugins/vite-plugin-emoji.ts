import { Plugin} from 'vite';
// A Vite Plugin is essentially a function.
const emojiMap = {
    ':smile:':'😄',
    ':sad:':'😢',
    ':laugh:':'😂',
    ':cry:':'😭',
    ':angry:':'😡',
    ':surprise:':'😲',
    ':heart:':'❤️',
    ':broken_heart:':'💔',
    ':thumbsup:':'👍',
    ':thumbsdown:':'👎',
    ':rocket:':'🚀',
    ':star:':'⭐',
    ':zap:':'⚡️',
    ':fire:':'🔥',
    ':sparkles:':'✨',
    ':tada:':'🎉',
    ':confetti_ball:':'🎊',
    ':balloon:':'🎈',
    ':party:':'🎉',
    ':cake:':'🍰',
    ':dizzy:':'💫',
}


export function miracleVitePluginEmoji():Plugin {
    return {
        name:'miracle-vite-plugin-emoji',
        transform(code,id){
            let transformedCode = code.replace(/:smile:/g,'😄')

            // loop through the map and replace the emoji
            for (const [key, value] of Object.entries(emojiMap)) {
                transformedCode = transformedCode.replace(new RegExp(key, 'g'), value)
                console.log(key,value)
            }




            //console.log(transformedCode)
            return transformedCode;
        }
    }
}