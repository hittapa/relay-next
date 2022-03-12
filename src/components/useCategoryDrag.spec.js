import { rearrange } from './useCategoryDrag'

const data = [1, 2, 3, 4, 5, 6, 7]

test('drag 1 to 2', () => {
    expect(rearrange(data, 0, 1)).toEqual([2, 1, 3, 4, 5, 6, 7]);
    expect(rearrange(data, 0, 2)).toEqual([2, 3, 1, 4, 5, 6, 7]);
    expect(rearrange(data, 0, 3)).toEqual([2, 3, 4, 1, 5, 6, 7]);
    expect(rearrange(data, 1, 0)).toEqual([2, 1, 3, 4, 5, 6, 7]);
    expect(rearrange(data, 1, 6)).toEqual([1, 3, 4, 5, 6, 7, 2]);
    expect(rearrange(data, 2, 3)).toEqual([1, 2, 4, 3, 5, 6, 7]);
    expect(rearrange(data, 2, 0)).toEqual([3, 1, 2, 4, 5, 6, 7]);
    expect(rearrange(data, 5, 0)).toEqual([6, 1, 2, 3, 4, 5, 7]);
    expect(rearrange(data, 5, 6)).toEqual([1, 2, 3, 4, 5, 7, 6]);
    expect(rearrange(data, 4, 0)).toEqual([5, 1, 2, 3, 4, 6, 7]);
    expect(rearrange(data, 4, 5)).toEqual([1, 2, 3, 4, 6, 5, 7]);
});