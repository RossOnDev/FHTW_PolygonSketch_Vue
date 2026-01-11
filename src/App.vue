<script setup lang="ts">
import Button from "./components/Button.vue";
import {Ref, ref} from "vue";
import {Position} from "./type/Position.ts";

const canvas: Ref<HTMLCanvasElement | undefined> = ref();


const polygons: Ref<Position[][]> = ref([]);
const polygonsHistory: Ref<Position[][]> = ref([]);

const currentPolygon: Ref<Position[]> = ref([]);
const currentPolygonHistory: Ref<Position[]> = ref([]);
const currentMousePos: Ref<Position | undefined> = ref();


function addVertex(e: MouseEvent) {
  currentPolygonHistory.value = [];
  currentPolygon.value.push(getPosition(e));
  draw();
}

function updateMouse(e: MouseEvent) {
  currentMousePos.value = getPosition(e);
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


  if (polygons.value.length > 0) {
    polygons.value.forEach(polygon => {
      ctx.beginPath();
      ctx.moveTo(polygon[0].x, polygon[0].y);
      polygon.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.closePath();
      ctx.stroke();
    });
  }


  if (currentPolygon.value.length > 0) {
    ctx.beginPath();
    ctx.moveTo(currentPolygon.value[0].x, currentPolygon.value[0].y);

    currentPolygon.value.forEach(vertex => ctx.lineTo(vertex.x, vertex.y));

    if (currentMousePos.value) {
      ctx.lineTo(currentMousePos.value.x, currentMousePos.value.y);
    }

    ctx.stroke();
  }
}

function finishPolygon() {
  polygons.value.push([...currentPolygon.value]);

  currentPolygon.value = [];
  currentMousePos.value = undefined;
  draw();
}

function clearCanvas() {
  const ctx = canvas.value!.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height);
}

function undo() {
  if (currentPolygon.value.length === 0 && polygons.value.length > 0) {
    const popped = polygons.value.pop();
    if (popped) {
      polygonsHistory.value.push(popped);
      currentPolygon.value = [...popped];
    }
  }

  const popped = currentPolygon.value.pop();
  if (popped) currentPolygonHistory.value.push(popped);

  draw();
}

function redo() {
  const popped = currentPolygonHistory.value.pop();
  if (popped) {
    currentPolygon.value.push(popped);
  }

  draw();
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

<style scoped>
</style>
