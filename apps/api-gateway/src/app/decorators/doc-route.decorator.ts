import { Get, Post, Put, Patch, Delete, applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function DocGet(path: string | undefined, type?: new (...args: unknown[]) => unknown) {
  const decorators = [
    path !== undefined ? Get(path) : Get(),
    ApiResponse({
      status: 200,
      ...(type && { type }),
    }),
  ];
  return applyDecorators(...decorators);
}

export function DocPost(path: string | undefined, type?: new (...args: unknown[]) => unknown) {
  const decorators = [
    path !== undefined ? Post(path) : Post(),
    ApiResponse({
      status: 201,
      ...(type && { type }),
    }),
  ];
  return applyDecorators(...decorators);
}

export function DocPut(path: string | undefined, type?: new (...args: unknown[]) => unknown) {
  const decorators = [
    path !== undefined ? Put(path) : Put(),
    ApiResponse({
      status: 200,
      ...(type && { type }),
    }),
  ];
  return applyDecorators(...decorators);
}

export function DocPatch(path: string | undefined, type?: new (...args: unknown[]) => unknown) {
  const decorators = [
    path !== undefined ? Patch(path) : Patch(),
    ApiResponse({
      status: 200,
      ...(type && { type }),
    }),
  ];
  return applyDecorators(...decorators);
}

export function DocDelete(path: string | undefined, type?: new (...args: unknown[]) => unknown) {
  const decorators = [
    path !== undefined ? Delete(path) : Delete(),
    ApiResponse({
      status: 200,
      ...(type && { type }),
    }),
  ];
  return applyDecorators(...decorators);
}
