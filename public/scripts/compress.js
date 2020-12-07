export const compress = (video) => {
    //replace creators
    let clipCreators = [];
    for(let clip of video.clips) {
        if(!clipCreators.includes(clip.creator_name)) {
            clipCreators.push(clip.creator_name);
        }
    }
    for(let clip of video.clips) {
        let index = clipCreators.indexOf(clip.creator_name);
        clip.creator_name = index;
    }
    video.creators = clipCreators;

    // replace keys
    let clipKeys = Object.keys(video.clips[0]);
    for(let clip of video.clips) {
        for(let key in clip) {
            let index = clipKeys.indexOf(key);
            clip[`${index}`] = clip[key];
            delete clip[key];
        }
    }
    video.keys = clipKeys;

    console.log(JSON.stringify(video));
}

export const decompress = () => {

}