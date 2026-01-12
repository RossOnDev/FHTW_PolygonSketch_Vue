<script setup lang="ts">

import {ref, Ref} from "vue";
import {Model} from "./type/Model.ts";
import Button from "./components/Button.vue";

const canvas: Ref<HTMLCanvasElement | undefined> = ref();
const model: Ref<Model | undefined> = ref()

function addVertex(e: MouseEvent) {
  const pos = getPosition(e);

  if (model.value === undefined) {
    model.value = {
      mousePos: pos,
      currentPolygon: [pos],
      finishedPolygons: [],
      future: undefined,
      past: undefined
    }

    draw();
    return;
  }

  const past = model.value;
  model.value = {
    mousePos: pos,
    currentPolygon: [...model.value.currentPolygon, pos],
    finishedPolygons: model.value.finishedPolygons,
    past: past,
    future: model.value.future
  }

  draw();
}

function finishPolygon() {
  if (!model.value) return;

  const {finishedPolygons, currentPolygon, future, past, mousePos} = model.value;

  model.value = {
    finishedPolygons: [...finishedPolygons, currentPolygon],
    currentPolygon: [],
    future: future,
    past: past,
    mousePos: mousePos
  }
}

function updateMouse(e: MouseEvent) {
  if (model.value) {
    model.value.mousePos = getPosition(e);
    draw();
  }
}

function undo() {
  if (model.value?.past) {
    const past = (model.value.past);
    past.future = model.value;
    model.value = past;
  }

  draw();
}

function redo() {
  if (model.value?.future) model.value = model.value.future

  draw();
}


function getPosition(e: MouseEvent) {
  const rect = canvas.value!.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
}

function draw() {
  clearCanvas();
  const ctx = canvas.value!.getContext("2d")!;
  ctx.strokeStyle = "white";

  const {currentPolygon, finishedPolygons, mousePos} = model.value!;

  if (finishedPolygons.length > 0) {
    finishedPolygons.forEach(polygon => {
      ctx.beginPath();
      ctx.moveTo(polygon[0].x, polygon[0].y);
      polygon.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    });
  }


  if (currentPolygon.length > 0) {
    ctx.beginPath();
    ctx.moveTo(currentPolygon[0].x, currentPolygon[0].y);

    currentPolygon.forEach(vertex => ctx.lineTo(vertex.x, vertex.y));

    if (mousePos) {
      ctx.lineTo(mousePos.x, mousePos.y);
    }

    ctx.stroke();
  }
}

function clearCanvas() {
  const ctx = canvas.value!.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height);
}

</script>

<template>
  <div class="prose p-10">
    <h1 class="text-white">Polygon Sketch</h1>

    <div class="flex gap-3">
      <Button @click="undo" text="Undo"/>
      <Button @click="redo" text="Redo"/>
    </div>

    <div class="mt-10">
      <main>
        <canvas ref="canvas" class="bg-white/5" width="800" height="700"
                @click="addVertex"
                @dblclick="finishPolygon"
                @mousemove="updateMouse"
        ></canvas>
      </main>
    </div>
  </div>

</template>