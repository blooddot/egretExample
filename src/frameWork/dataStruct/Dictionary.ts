/**
 * @author 雪糕 
 * @desc 字典
 * @date 2020-02-08 16:36:11 
 * @Last Modified by 雪糕 
 * @Last Modified time 2020-02-08 16:36:11 
 */
// Used internally by dictionary
interface IDictionaryPair<K, V> {
    key: K;
    value: V;
}

class Dictionary<K, V> {

    /**
     * Object holding the key-value pairs.
     * @type {Object}
     * @private
     */
    protected table: { [key: string]: IDictionaryPair<K, V> };
    //: [key: K] will not work since indices can only by strings in javascript and typescript enforces this.

    /**
     * Number of elements in the list.
     * @type {number}
     * @private
     */
    protected nElements: number;

    /**
     * Function used to convert keys to strings.
     * @type {function(Object):string}
     * @protected
     */
    protected toStr: (key: K) => string;


    /**
     * Creates an empty dictionary.
     * @class <p>Dictionaries map keys to values; each key can map to at most one value.
     * This implementation accepts any kind of objects as keys.</p>
     *
     * <p>If the keys are custom objects a function which converts keys to unique
     * strings must be provided. Example:</p>
     * <pre>
     * function petToString(pet) {
     *  return pet.name;
     * }
     * </pre>
     * @constructor
     * @param {function(Object):string=} toStrFunction optional function used
     * to convert keys to strings. If the keys aren't strings or if toString()
     * is not appropriate, a custom function which receives a key and returns a
     * unique string must be provided.
     */
    public constructor(toStrFunction?: (key: K) => string) {
        this.table = {};
        this.nElements = 0;
        this.toStr = toStrFunction || this.defaultToString;
    }


    /**
     * Returns the value to which this dictionary maps the specified key.
     * Returns undefined if this dictionary contains no mapping for this key.
     * @param {Object} key key whose associated value is to be returned.
     * @return {*} the value to which this dictionary maps the specified key or
     * undefined if the map contains no mapping for this key.
     */
    public getValue(key: K): V | undefined {
        const pair: IDictionaryPair<K, V> = this.table['$' + this.toStr(key)];
        if (this.isUndefined(pair)) {
            return undefined;
        }
        return pair.value;
    }

    // public getValueByProperty(property: string, value: any): V | undefined {
    //     for (const name in this.table) {
    //         if (this.has(this.table, name)) {
    //             const pair: IDictionaryPair<K, V> = this.table[name];
    //             if (pair[property] && pair[property] == value) {
    //                 return pair.value;
    //             }
    //         }
    //     }
    //     return null;
    // }

    /**
     * Associates the specified value with the specified key in this dictionary.
     * If the dictionary previously contained a mapping for this key, the old
     * value is replaced by the specified value.
     * @param {Object} key key with which the specified value is to be
     * associated.
     * @param {Object} value value to be associated with the specified key.
     * @return {*} previous value associated with the specified key, or undefined if
     * there was no mapping for the key or if the key/value are undefined.
     */
    public setValue(key: K, value: V): V | undefined {
        if (this.isUndefined(key) || this.isUndefined(value)) {
            return undefined;
        }

        let ret: V | undefined;
        const k = '$' + this.toStr(key);
        const previousElement: IDictionaryPair<K, V> = this.table[k];
        if (this.isUndefined(previousElement)) {
            this.nElements++;
            ret = undefined;
        } else {
            ret = previousElement.value;
        }
        this.table[k] = {
            key: key,
            value: value
        };
        return ret;
    }

    /**
     * Removes the mapping for this key from this dictionary if it is present.
     * @param {Object} key key whose mapping is to be removed from the
     * dictionary.
     * @return {*} previous value associated with specified key, or undefined if
     * there was no mapping for key.
     */
    public remove(key: K): V | undefined {
        const k = '$' + this.toStr(key);
        const previousElement: IDictionaryPair<K, V> = this.table[k];
        if (!this.isUndefined(previousElement)) {
            delete this.table[k];
            this.nElements--;
            return previousElement.value;
        }
        return undefined;
    }

    /**
     * Returns an array containing all of the keys in this dictionary.
     * @return {Array} an array containing all of the keys in this dictionary.
     */
    public get keys(): K[] {
        const array: K[] = [];
        for (const name in this.table) {
            if (this.has(this.table, name)) {
                const pair: IDictionaryPair<K, V> = this.table[name];
                array.push(pair.key);
            }
        }
        return array;
    }

    /**
     * Returns an array containing all of the values in this dictionary.
     * @return {Array} an array containing all of the values in this dictionary.
     */
    public get values(): V[] {
        const array: V[] = [];
        for (const name in this.table) {
            if (this.has(this.table, name)) {
                const pair: IDictionaryPair<K, V> = this.table[name];
                array.push(pair.value);
            }
        }
        return array;
    }

    /**
    * Executes the provided function once for each key-value pair
    * present in this dictionary.
    * @param {function(Object,Object):*} callback function to execute, it is
    * invoked with two arguments: key and value. To break the iteration you can
    * optionally return false.
    */
    public forEach(callback: (value: V, key: K) => any): void {
        for (const name in this.table) {
            if (this.has(this.table, name)) {
                const pair: IDictionaryPair<K, V> = this.table[name];
                const ret = callback(pair.value, pair.key);
                if (ret === false) {
                    return;
                }
            }
        }
    }

    public mapValues<U>(callback: (value: V, key: K) => U, thisArg?: any): U[] {
        let result: U[] = [];
        for (const name in this.table) {
            if (this.has(this.table, name)) {
                const pair: IDictionaryPair<K, V> = this.table[name];
                result.push(callback(pair.value, pair.key));
            }
        }

        return result;
    }

    public map<U>(callback: (value: V, key: K) => U, thisArg?: any): Dictionary<K, U> {
        let result: Dictionary<K, U> = new Dictionary<K, U>();
        for (const name in this.table) {
            if (this.has(this.table, name)) {
                const pair: IDictionaryPair<K, V> = this.table[name];
                result.setValue(pair.key, callback(pair.value, pair.key));
            }
        }

        return result;
    }

    /**
     * 返回符合条件的元素Dictionary集合
     * @param callbackfn 
     * @param thisArg 
     */
    public filter(callbackfn: (value: V, key: K) => boolean, thisArg?: any): Dictionary<K, V> {
        const newOne = new Dictionary<K, V>();
        for (const name in this.table) {
            if (this.has(this.table, name)) {
                const pair: IDictionaryPair<K, V> = this.table[name];
                const ret = callbackfn(pair.value, pair.key);
                if (ret) {
                    newOne.setValue(pair.key, pair.value);
                }
            }
        }

        return newOne;
    }

    /**
     * 返回符合条件的元素数组
     * @param callbackfn 
     * @param thisArg 
     */
    public filterValues(callbackfn: (value: V, key: K) => boolean, thisArg?: any): V[] {
        const array: V[] = [];
        for (const name in this.table) {
            if (this.has(this.table, name)) {
                const pair: IDictionaryPair<K, V> = this.table[name];
                const ret = callbackfn(pair.value, pair.key);
                if (ret) {
                    array.push(pair.value);
                }
            }
        }
        return array;
    }

    /**
     * 查找符合条件的元素key
     * @param predicate 
     * @param thisArg 
     */
    public findKey(predicate: (value: V, key: K) => boolean, thisArg?: any): K | undefined {
        for (const name in this.table) {
            if (this.has(this.table, name)) {
                const pair: IDictionaryPair<K, V> = this.table[name];
                const ret = predicate(pair.value, pair.key);
                if (ret) {
                    return pair.key;
                }
            }
        }
        return undefined;
    }

    /**
     * 查找符合条件的元素
     * @param predicate 
     * @param thisArg 
     */
    public findValue(predicate: (value: V, key: K) => boolean, thisArg?: any): V | undefined {
        for (const name in this.table) {
            if (this.has(this.table, name)) {
                const pair: IDictionaryPair<K, V> = this.table[name];
                const ret = predicate(pair.value, pair.key);
                if (ret) {
                    return pair.value;
                }
            }
        }
        return undefined;
    }


    public some(callbackfn: (value: V, key: K) => boolean, thisArg?: any): boolean {
        for (const name in this.table) {
            if (this.has(this.table, name)) {
                const pair: IDictionaryPair<K, V> = this.table[name];
                const ret = callbackfn(pair.value, pair.key);
                if (ret) {
                    return true;
                }
            }
        }
        return false;
    }

    public every(callbackfn: (value: V, key: K) => boolean, thisArg?: any): boolean {
        for (const name in this.table) {
            if (this.has(this.table, name)) {
                const pair: IDictionaryPair<K, V> = this.table[name];
                const ret = callbackfn(pair.value, pair.key);
                if (!ret) {
                    return false;
                }
            }
        }
        return true;
    }


    /**
     * 浅克隆
     */
    public clone(): Dictionary<K, V> {
        let newOne = new Dictionary<K, V>();
        this.forEach((value, key) => newOne.setValue(key, value));
        return newOne;
    }

    /**
     * Returns true if this dictionary contains a mapping for the specified key.
     * @param {Object} key key whose presence in this dictionary is to be
     * tested.
     * @return {boolean} true if this dictionary contains a mapping for the
     * specified key.
     */
    public containsKey(key: K): boolean {
        return !this.isUndefined(this.getValue(key));
    }

    // public containsKeyByProperty(property: string, value: any): boolean {
    //     for (const name in this.table) {
    //         if (this.has(this.table, name)) {
    //             const pair: IDictionaryPair<K, V> = this.table[name];
    //             if (pair[property] && pair[property] == value) {
    //                 return true;
    //             }
    //         }
    //     }
    //     return false;
    // }

    /**
    * Removes all mappings from this dictionary.
    * @this {collections.Dictionary}
    */
    public clear() {
        this.table = {};
        this.nElements = 0;
    }

    /**
     * Returns the number of keys in this dictionary.
     * @return {number} the number of key-value mappings in this dictionary.
     */
    public get size(): number {
        return this.nElements;
    }

    /**
     * Returns true if this dictionary contains no mappings.
     * @return {boolean} true if this dictionary contains no mappings.
     */
    public isEmpty(): boolean {
        return this.nElements <= 0;
    }

    public toString(): string {
        let toret = '{';
        this.forEach((v, k) => {
            toret += `\n\t${k} : ${v}`;
        });
        return toret + '\n}';
    }

    private has(obj: any, prop: any) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    };

    /**
     * Default function to compare element order.
     * @function
     */
    private defaultCompare<T>(a: T, b: T): number {
        if (a < b) {
            return -1;
        } else if (a === b) {
            return 0;
        } else {
            return 1;
        }
    }

    /**
     * Default function to test equality.
     * @function
     */
    private defaultEquals<T>(a: T, b: T): boolean {
        return a === b;
    }

    /**
     * Default function to convert an object to a string.
     * @function
     */
    private defaultToString(item: any): string {
        if (item === null) {
            return 'COLLECTION_NULL';
        } else if (this.isUndefined(item)) {
            return 'COLLECTION_UNDEFINED';
        } else if (this.isString(item)) {
            return '$s' + item;
        } else {
            return '$o' + item.toString();
        }
    }

    /**
    * Joins all the properies of the object using the provided join string
    */
    private makeString<T>(item: T, join: string = ','): string {
        if (item === null) {
            return 'COLLECTION_NULL';
        } else if (this.isUndefined(item)) {
            return 'COLLECTION_UNDEFINED';
        } else if (this.isString(item)) {
            return item.toString();
        } else {
            let toret = '{';
            let first = true;
            for (const prop in item) {
                if (this.has(item, prop)) {
                    if (first) {
                        first = false;
                    } else {
                        toret = toret + join;
                    }
                    toret = toret + prop + ':' + (<any>item)[prop];
                }
            }
            return toret + '}';
        }
    }

    /**
     * Checks if the given argument is a function.
     * @function
     */
    private isFunction(func: any): boolean {
        return (typeof func) === 'function';
    }

    /**
     * Checks if the given argument is undefined.
     * @function
     */
    private isUndefined(obj: any): obj is undefined {
        return (typeof obj) === 'undefined';
    }

    /**
     * Checks if the given argument is a string.
     * @function
     */
    private isString(obj: any): boolean {
        return Object.prototype.toString.call(obj) === '[object String]';
    }

    /**
     * Reverses a compare function.
     * @function
     */
    private reverseCompareFunction<T>(compareFunction?: ICompareFunction<T>): ICompareFunction<T> {
        if (this.isUndefined(compareFunction) || !this.isFunction(compareFunction)) {
            return function (a, b) {
                if (a < b) {
                    return 1;
                } else if (a === b) {
                    return 0;
                } else {
                    return -1;
                }
            };
        } else {
            return function (d: T, v: T) {
                return compareFunction(d, v) * -1;
            };
        }
    }

    /**
     * Returns an equal function given a compare function.
     * @function
     */
    private compareToEquals<T>(compareFunction: ICompareFunction<T>): IEqualsFunction<T> {
        return function (a: T, b: T) {
            return compareFunction(a, b) === 0;
        };
    }
} // End of dictionary

/**
	* Function signature for comparing
	* <0 means a is smaller
	* = 0 means they are equal
	* >0 means a is larger
	*/
interface ICompareFunction<T> {
    (a: T, b: T): number;
}

/**
* Function signature for checking equality
*/
interface IEqualsFunction<T> {
    (a: T, b: T): boolean;
}

/**
* Function signature for Iterations. Return false to break from loop
*/
interface ILoopFunction<T> {
    (a: T): boolean | void;
}
