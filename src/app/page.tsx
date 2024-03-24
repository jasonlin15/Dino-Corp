'use client';
import Image from "next/image";
import {generateDoc} from "./doc-generator";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <button className="docuHell" onClick={generateDoc} type="button">ClickMe </button>
    </main>
  );
}