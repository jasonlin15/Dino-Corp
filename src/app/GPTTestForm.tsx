'use client'
import {useState} from 'react'

import * as gpt from './chatgpt'
import {ChatMessage} from 'chatgpt'

interface ILastResponse {
  lastResponse?: ChatMessage
}

export default function GPTTestForm() {
  const [response, setResponse] = useState('')
  const [lastMsg, setLastMsg] = useState<ILastResponse>({})

  async function send() {
    const msg = await gpt.generateQuestions("File Systems", "Operating Systems", 4, 2, 2, 2)
    setResponse(msg.text)
    setLastMsg(({lastResponse: msg}))
  }

  async function harder() {
    if (!lastMsg.lastResponse) return
    const msg = await gpt.makeHarder(lastMsg.lastResponse)
    setResponse(msg.text)
    setLastMsg(({lastResponse: msg}))
  }

  async function easier() {
    if (!lastMsg.lastResponse) return
    const msg = await gpt.makeEasier(lastMsg.lastResponse)
    setResponse(msg.text)
    setLastMsg(({lastResponse: msg}))
  }

  async function parse() {
    const test = `### Multiple Choice Questions
1. What is the main purpose of a file system in an operating system?
    A) To store only executable files
    B) To manage and organize files on storage devices
    C) To control the flow of data between hardware components
    D) To allocate memory for running processes

2. Which of the following is not a type of file system?
    A) FAT32
    B) NTFS
    C) HTML
    D) ext4

3. What does FAT stand for in relation to file systems?
    A) File Access Table
    B) File Allocation Table
    C) Fast Action Table
    D) Folder Allocation Table

4. In a Unix-like operating system, what command is used to display disk usage statistics and available space?
    A) ls
    B) du
    C) df
    D) top

5. Which file system is commonly used for optical discs such as DVDs?
    A) NTFS
    B) HFS+
    C) ISO 9660
    D) exFAT

6. What is fragmentation in the context of file systems?
    A) The process of organizing files alphabetically
    B) The process of compressing files to save space
    C) The scattering of file data across different locations on a disk
    D) The encryption of files for security purposes

7. Which file system is typically used by macOS?
    A) FAT32
    B) NTFS
    C) APFS
    D) ext4

8. What is the maximum number of files that can be stored in a single directory in the FAT32 file system?
    A) 65,536
    B) 256
    C) 4,294,967,295
    D) 512

9. Which of the following is not a common file system feature?
    A) Encryption
    B) Compression
    C) Virtualization
    D) Permission management

10. Which file system was introduced with Windows Vista as a replacement for FAT and NTFS on some flash drives?
    A) exFAT
    B) FAT12
    C) ReFS
    D) ext3

### True/False Questions
11. True or False: Journaling is a technique used in file systems to improve reliability.
12. True or False: Inode is a data structure used in file systems to store information about files and directories.
13. True or False: A hard link in a file system points to the actual data of a file.
14. True or False: RAID stands for Redundant Array of Independent Disks and is not related to file systems.

### Short Answer Questions
15. Explain the concept of "inode" in file systems.
16. Describe the purpose of journaling in a file system.

### Long Answer Questions
17. Compare and contrast FAT32 and NTFS file systems in terms of features and limitations.
18. Discuss the importance of file system consistency and explain how it is maintained in operating systems.`
    const msg = gpt.parseResponse(test)
    console.log(msg)
  }

  return (
    <>
      <form action={send}>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Test Query
        </button>
      </form>
      <form action={harder}>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Make Questions Harder
        </button>
      </form>
      <form action={easier}>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Make Questions Easier
        </button>
      </form>
      <form action={parse}>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Serialize test
        </button>
      </form>
      <pre>{response}</pre>
    </>
  );
}
