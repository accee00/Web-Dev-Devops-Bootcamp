class Shape {

    constructor(color) {
        this.color = color;
    }

    paint() {
        console.log(`Painting with ${this.color}`);
    }

    area() {
        throw new Error('This area method must be implemented int the sub-class.');
    }
}

class Rectangle extends Shape {

    constructor(width, height, color) {
        super(color);
        this.width = width;
        this.height = height;
    }

    area() {
        return this.height * this.width;
    }

    parameter() {
        return 2 * (this.height + this.width);
    }
}

class Circle extends Shape {
    constructor(radius, color) {
        super(color);
        this.radius = radius;
    }

    area() {
        return 3.14 * this.radius * this.radius;
    }

    perimeter() {
        return 2 * 3.14 * (this.radius);
    }

}

class Square extends Shape {

    constructor(side, color) {
        super(color);
        this.side = side;
    }

    area() {
        return this.side * this.side;
    }

    perimeter() {
        return 4 * this.side;
    }
}


/// What if class concept is not present

// function areaUsingMap(r) {
//     return r.width * r.height;
// }


// let rect1 = {
//     width: 30,
//     height: 23,
//     color: "Red"
// };

// let rect2 = {
//     width: 50,
//     height: 12,
//     color: "Green",
// }

// console.log(`Area using map: ${areaUsingMap(rect1)}`)