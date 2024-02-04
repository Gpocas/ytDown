import fs from 'fs';
import ytdl from 'ytdl-core';
import { spawn } from 'child_process';

export async function baixarEConverterVideo(url) {
    try {

        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/\|/g, '')
        const format_video = ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'videoonly' });
        const format_audio = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });
        const command = `ffmpeg -i "temp/${title}.mp4" -i "temp/${title}.wav" -c:v copy -c:a aac -y "videos/${title}.mp4"`;

        const videoPromise = new Promise((resolve) => {
            ytdl.downloadFromInfo(info, { format: format_video }).pipe(fs.createWriteStream(`./temp/${title}.mp4`))
                .on('finish', resolve);
        });

        const audioPromise = new Promise((resolve) => {
            ytdl.downloadFromInfo(info, { format: format_audio }).pipe(fs.createWriteStream(`./temp/${title}.wav`))
                .on('finish', resolve);
        });

        await Promise.all([videoPromise, audioPromise]);

        // Ambos os downloads foram concluídos, agora podemos executar o comando ffmpeg

        const ffmpegProcess = spawn('cmd.exe', ['/c', command], { shell: true });

        ffmpegProcess.on('close', (code) => {
            console.log(`Processo ffmpeg encerrado com código ${code}`);
        });

        // ----------------------- Exibir o stderr do comando ffmpeg ----------------------- 
        // ffmpegProcess.stderr.on('data', function(chunk){
        //     var textChunk = chunk.toString('utf8');
        //     console.error(textChunk);
        // });

        // ----------------------- Caso queira que o processo seja sicrono descomente o bloco abaixo ----------------------- 
        // const ffmpegProcess = new Promise ((resolve) => {
        //     spawn('cmd.exe', ['/c', command], { shell: true }).on('close', resolve);  
        // })

        // await Promise.all([ffmpegProcess]);

    } catch (error) {
        console.error('Erro:', error);
    }
}