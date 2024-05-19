// javascript if else ธรรมดาปกติ;
// let x = 'peeme'
// if (x == "peeme") {
//     var hasName = 'Y';
// } else if (x == "false") {
//     var hasName = 'N';
// };

// javascript if else แบบ short hand;
// let x = 'peeme'
// let hasName = (x === 'peeme') ? 'Y' : 'N';

// console.log('x: ', x)


// +++++ เปรียบเทียม วันและเดือน
function compareDateAndMonth(date1: any, date2: any) {
    // Extract month and date components
    const month1 = date1.getMonth();
    const day1 = date1.getDate();
    const month2 = date2.getMonth();
    const day2 = date2.getDate();

    // Compare month and date components
    if (month1 === month2 && day1 === day2) {
        return 0; // Dates are equal
    } else if (month1 < month2 || (month1 === month2 && day1 < day2)) {
        return -1; // date1 is earlier than date2
    } else {
        return 1; // date1 is later than date2
    }

    // const comparisonResult = this.compareDateAndMonth(date1, date2);

    // if (comparisonResult === 0) {
    //   console.log("Dates are equal in month and date.");
    // } else if (comparisonResult < 0) {
    //   console.log("Date 1 is earlier than Date 2.");
    // } else {
    //   console.log("Date 1 is later than Date 2.");
    // }

}
// ----- เปรียบเทียม วันและเดือน

/*
// Step 1: Create Date objects for the two dates
const date1 = new Date('2024-01-15');    // กำหนด 15 มค.
const date2 = new Date('2024-02-29');    // วันปลูก
const dategrowed = new Date('2023-12-09');

console.log('กำหนด 15 มค.', date1)
console.log('วันปลูก', date2)

// Step 2: Extract the year from each Date object
const year1 = date1.getFullYear();
const year2 = date2.getFullYear();
const yearg = dategrowed.getFullYear();

// Step 3: Compare the extracted years
if (year1 > year2) {
    console.log('ปีปัจจุบัน มากกว่า ปีวันปลูก OK ผ่าน');
} else if (year1 < year2) {
    console.log('ปีปัจจุบัน น้อยกว่า ปีวันปลูก');
} else {
    console.log('ปีปัจจุบัน เป็นปีเดียวกับ ปีวันปลูก');
    let x: any = compareDateAndMonth(date1, date2)
    console.log('จำนวนวันจาก 15 มค. และ วันปลูก', x)
    switch (x) {
        case 0:
            console.log('วันปลูก เท่ากับ 15 มค.')
            break;
        case 1:
            console.log('วันปลูก ภายใน 15 มค. OK')
            break;
        default:
            console.log('วันปลูก เกิน 15 มค. !!No..')
            break;
    }
}
*/

let x: string = '50'
let y: string = '50'
let xx = Number(x) + Number(y);
console.log('xx :', xx)



