# 📖 Introduction to OCR 
> A brief introduction to OCR. How does it work and use cases.


## ❓ What is OCR?

>**O**ptical **C**haracter **R**ecognition

*OCR* is a way to extract text from an **image** 🖼️ in order to be used by a **machine/computer** 💻.

They take images as INPUT and give text as output.

## 🛠️ Use cases

- Convert documents to PDF
- Extract data from *Bank* or *ID* cards 
- [Real world translation](https://support.google.com/translate/answer/6142483?hl=en&co=GENIE.Platform%3DAndroid)
- [Extract text from YouTube videos](https://chrome.google.com/webstore/detail/selectext-copy-text-from/gkkdmjjodidppndkbkhhknakbeflbomf?hl=en)
- [Traffic Sign Recognition (TSR)](https://www.jdpower.com/cars/shopping-guides/what-is-traffic-sign-recognition)
- [Vehicle plate recognition]()***
- Data storage **???** (Probably not ideal)

## Types of OCR Algorithms

## ⛑️ How does it work


## 📸 Prepare the images

OCR algorithms tend to be a bit *sensitive* so it's import to **preprocess** the images in order to get the desired output.

To preprocess the image we can apply a variety of filters but there are a few things that have to be taken into account before:

 - Lighting conditions
 - Angle
 - Text color
 - Text constrast with the background
 - Language and characters
 - Typography



## Clear the output
## ⌨️ Talk is cheap. Show me the code.

### Vehicle plate recognition

A small and basic script that detects and reads vehicle plates. (Tested with Spain plates): [Code here](./examples/car_plates/)

If you want to check a more polished product visit 
**[this link](https://platerecognizer.com/)**.

### Realtime text recognition

A webapp that reads from the device's camera in realtime. 
It lets the user configure the filters so the preprocessing can be adjusted to its needs. 

[Try it]() 

[Code here](./examples/id_recognition_web/)


## 📋 Summary

# References
 - https://www.ibm.com/cloud/blog/optical-character-recognition
 - https://en.wikipedia.org/wiki/Optical_character_recognition
 - https://www.necc.mass.edu/wp-content/uploads/accessible-media-necc/uncategorized/resources/What-is-OCR.pdf
 - https://scholar.harvard.edu/lingayas/presentations/optical-character-recognization
 - https://dsp.stackexchange.com/questions/8316/the-difference-between-bilateral-filter-and-gaussian-filter
 - https://dev.to/mathewthe2/using-javascript-to-preprocess-images-for-ocr-1jc