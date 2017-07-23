module.exports = (app) => {
    const PORT = app.get('port');
    app.listen(PORT, () => {
        console.log(`API running at port ${PORT}`);
    });
}