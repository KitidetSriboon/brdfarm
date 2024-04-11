let x = 100
switch (true) {
    case (x >= 50):
        console.log('is 50 or get than', x)
        break;
    case '' || null:
        console.log('is null ', x)
        break;
    case (x = 0) || null:
        console.log('is 0 ', x)
        break;
    default:
        console.log('out of condition', x)
        break;
}