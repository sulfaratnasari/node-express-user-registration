// number 1
function isPrime(num) {
    if (num == 2)
        return true;
    for (i = 2; i < Math.sqrt(num); i++) {
        if (num % i == 0)
            return false;
    }
    return true;
}
const num = 2
console.log(num + " is prime ? ", isPrime(num))

// number 2
function findBiggestNumber(arr) {
    let biggestNumber = arr[0];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > biggestNumber) {
            biggestNumber = arr[i];
        }
    }

    return biggestNumber;
}
const numbers = [11, 6, 31, 201, 99, 861, 1, 7, 14, 79];
const biggestNumber = findBiggestNumber(numbers);
console.log("Biggest Number:", biggestNumber);

// number 3
function printTriangle(rows) {
    for (let i = 1; i <= rows; i++) {
        let row = '';
        for (let j = 1; j <= i; j++) {
            row += j + ' ';
        }
        console.log(row);
    }
}

printTriangle(8);

// number 4
function bubbleSort(arr) {
    const n = arr.length;
    let swapped;

    do {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                // Swap arr[i] and arr[i+1]
                const temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                swapped = true;
            }
        }
    } while (swapped);

    return arr;
}

const originalArray = [99, 2, 64, 8, 111, 33, 65, 11, 102, 50];
const sortedArray = bubbleSort(originalArray);
console.log("Sorted Array:", sortedArray);

// number 5
function printPattern() {
    for (let i = 1; i <= 4; i++) {
        let row = '';
        for (let j = 1; j <= 3; j++) {
            const num = i + (j - 1) * 4;
            row += num + ' ';
        }
        console.log(row);
    }
}

printPattern();