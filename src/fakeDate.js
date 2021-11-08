import { v4 as uuidv4, v4 } from 'uuid';

const fakeRoomInit = (() => {
    let roomOptions = [];
    for (let i = 0; i < 4; i++) {
        roomOptions.push({ id: i + 1, value: `channel${i + 1}` });
    }
    return { roomOptions };
})();

export { fakeRoomInit };
