import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacings } from './spacings';

const getInset = (edge = 'all') => {
    if (!edge || edge === 'all') {
        return useSafeAreaInsets();
    }
    return useSafeAreaInsets()[edge];
};
const getInputBoxInsetTop = () => {
    const top = getInset('top');

    const android = Math.ceil(top) + spacings.half * 2 + 130;
    const ios = top < 47 ? 65 : Math.ceil(top) + spacings.half * 2;

    return [android, ios];
};

export default { getInset, getInputBoxInsetTop };
