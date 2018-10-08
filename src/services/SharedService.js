
export default {
    /**
     * Returns a uniq string
     */
    generateUniqID() {
        return (
            '_' +
            Math.random()
                .toString(36)
                .substr(2, 9)
        );
    },
};
