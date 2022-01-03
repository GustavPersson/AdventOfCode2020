import { wrapRotation } from "./index.js";

export class Vector2 {
  public constructor(public x: number, public y: number) {}

  public add(vec: Vector2): Vector2 {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }

  public subtract(vec: Vector2): Vector2 {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  }

  public multiply(vec: Vector2): Vector2 {
    this.x *= vec.x;
    this.y *= vec.y;
    return this;
  }

  public divide(vec: Vector2): Vector2 {
    this.x /= vec.x;
    this.y /= vec.y;
    return this;
  }

  public addScalar(scalar: number): Vector2 {
    this.x += scalar;
    this.y += scalar;
    return this;
  }

  public subtractScalar(scalar: number): Vector2 {
    this.x -= scalar;
    this.y -= scalar;
    return this;
  }

  public multiplyScalar(scalar: number): Vector2 {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  public divideScalar(scalar: number): Vector2 {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  public abs(): Vector2 {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    return this;
  }

  public sign(): Vector2 {
    this.x = Math.sign(this.x);
    this.y = Math.sign(this.y);
    return this;
  }

  public round(): Vector2 {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }

  public floor(): Vector2 {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  }

  public ceil(): Vector2 {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this;
  }

  public normalize(): Vector2 {
    if (this.x !== 0 || this.y !== 0) {
      this.divideScalar(this.length());
    }

    return this;
  }

  public lengthSquared(): number {
    return Math.pow(this.x, 2) + Math.pow(this.y, 2);
  }

  public length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  public manhattanLength(): number {
    return Math.abs(this.x) + Math.abs(this.y);
  }

  public distanceSquared(vec: Vector2): number {
    return vec.clone().subtract(this).lengthSquared();
  }

  public distance(vec: Vector2): number {
    return Math.sqrt(this.distanceSquared(vec));
  }

  public clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  public toArray(): number[] {
    return [this.x, this.y];
  }

  public rotateBy(angle: number): Vector2 {
    const sine = Math.sin(angle);
    const cosine = Math.cos(angle);

    [this.x, this.y] = [this.x * cosine - this.y * sine, this.x * sine + this.y * cosine];
    return this;
  }

  public toRotation(): number {
    return Math.atan2(this.y, this.x);
  }

  public equals(vec: Vector2): boolean {
    return this.x === vec.x && this.y === vec.y;
  }

  public greaterThan(vec: Vector2): boolean {
    return this.x > vec.x && this.y > vec.y;
  }

  public lessThan(vec: Vector2): boolean {
    return this.x < vec.x && this.y < vec.y;
  }

  public equalOrGreaterThan(vec: Vector2): boolean {
    return this.x >= vec.x && this.y >= vec.y;
  }

  public equalOrLessThan(vec: Vector2): boolean {
    return this.x <= vec.x && this.y <= vec.y;
  }

  public static fromArray(arr: number[]): Vector2 {
    if (arr.length < 2) throw new Error("Vector2 array must have at least 2 elements");
    return new Vector2(arr[0], arr[1]);
  }
}

export class Vector3 {
  public constructor(public x: number, public y: number, public z: number) {}

  public add(vec: Vector3): Vector3 {
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;
    return this;
  }

  public subtract(vec: Vector3): Vector3 {
    this.x -= vec.x;
    this.y -= vec.y;
    this.z -= vec.z;
    return this;
  }

  public multiply(vec: Vector3): Vector3 {
    this.x *= vec.x;
    this.y *= vec.y;
    this.z *= vec.z;
    return this;
  }

  public divide(vec: Vector3): Vector3 {
    this.x /= vec.x;
    this.y /= vec.y;
    this.z /= vec.z;
    return this;
  }

  public addScalar(scalar: number): Vector3 {
    this.x += scalar;
    this.y += scalar;
    this.z += scalar;
    return this;
  }

  public subtractScalar(scalar: number): Vector3 {
    this.x -= scalar;
    this.y -= scalar;
    this.z -= scalar;
    return this;
  }

  public multiplyScalar(scalar: number): Vector3 {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }

  public divideScalar(scalar: number): Vector3 {
    this.x /= scalar;
    this.y /= scalar;
    this.z /= scalar;
    return this;
  }

  public abs(): Vector3 {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    this.z = Math.abs(this.z);
    return this;
  }

  public sign(): Vector3 {
    this.x = Math.sign(this.x);
    this.y = Math.sign(this.y);
    this.z = Math.sign(this.z);
    return this;
  }

  public round(): Vector3 {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
    return this;
  }

  public floor(): Vector3 {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);
    return this;
  }

  public ceil(): Vector3 {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);
    return this;
  }

  public normalize(): Vector3 {
    if (this.x !== 0 || this.y !== 0 || this.z !== 0) {
      this.divideScalar(this.length());
    }

    return this;
  }

  public lengthSquared(): number {
    return Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2);
  }

  public length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  public manhattanLength(): number {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }

  public distanceSquared(vec: Vector3): number {
    return vec.clone().subtract(this).lengthSquared();
  }

  public distance(vec: Vector3): number {
    return Math.sqrt(this.distanceSquared(vec));
  }

  public clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  public toArray(): number[] {
    return [this.x, this.y, this.z];
  }

  public rotateByX(angle: number): Vector3 {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    [this.y, this.z] = [this.y * cos - this.z * sin, this.y * sin + this.z * cos];
    return this;
  }

  public rotateByY(angle: number): Vector3 {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    [this.x, this.z] = [this.x * cos - this.z * sin, -this.x * sin + this.z * cos];
    return this;
  }

  public rotateByZ(angle: number): Vector3 {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    [this.x, this.y] = [this.x * cos - this.y * sin, this.x * sin + this.y * cos];
    return this;
  }

  public toRotationX(): number {
    return wrapRotation(Math.atan2(this.y, this.z));
  }

  public toRotationY(): number {
    return wrapRotation(Math.atan2(this.z, this.x));
  }

  public toRotationZ(): number {
    return wrapRotation(Math.atan2(this.y, this.x));
  }

  public equals(vec: Vector3): boolean {
    return this.x === vec.x && this.y === vec.y && this.z === vec.z;
  }

  public greaterThan(vec: Vector3): boolean {
    return this.x > vec.x && this.y > vec.y && this.z > vec.z;
  }

  public lessThan(vec: Vector3): boolean {
    return this.x < vec.x && this.y < vec.y && this.z < vec.z;
  }

  public equalOrGreaterThan(vec: Vector3): boolean {
    return this.x >= vec.x && this.y >= vec.y && this.z >= vec.z;
  }

  public equalOrLessThan(vec: Vector3): boolean {
    return this.x <= vec.x && this.y <= vec.y && this.z <= vec.z;
  }

  public static fromArray(arr: number[]): Vector3 {
    if (arr.length < 3) throw new Error("Vector3 array must have at least 3 elements");
    return new Vector3(arr[0], arr[1], arr[2]);
  }
}
