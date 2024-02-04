import { baixarEConverterVideo } from "./func.js"

let urls = [
    'https://www.youtube.com/watch?v=tKJyBEad3i4',
    'https://www.youtube.com/watch?v=UrB7fXG3GjI',
    'https://www.youtube.com/watch?v=YFqLzEhg6ME'
]

for (const url of urls) {
    baixarEConverterVideo(url);
}

  
