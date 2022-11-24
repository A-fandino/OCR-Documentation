# 📖 Introduction to OCR 
> A brief introduction to OCR. How does it work and use cases.


## ❓ What is OCR?

```Optical Character Recognition```

*OCR* is a way to extract text from an **image** 🖼️ in order to be used by a **machine/computer** 💻.

Those algorithms take images as INPUT and give text as OUTPUT.

## 🛠️ Use cases

- Convert documents to PDF
- Extract data from *Bank* or *ID* cards 
- [Real world translation](https://support.google.com/translate/answer/6142483?hl=en&co=GENIE.Platform%3DAndroid)
- [Extract text from YouTube videos](https://chrome.google.com/webstore/detail/selectext-copy-text-from/gkkdmjjodidppndkbkhhknakbeflbomf?hl=en)
- [Traffic Sign Recognition (TSR)](https://www.jdpower.com/cars/shopping-guides/what-is-traffic-sign-recognition)
- [Vehicle plate recognition](./examples/car_plates/)
- Data storage **???** (Probably not ideal)

## 📸 Prepare the images

OCR algorithms tend to be a bit *sensitive* so it's important to **preprocess** the images in order to get the desired output.

To preprocess the image we can apply a variety of filters but there are a few things that have to be taken into account before:

 - 🔦 Lighting conditions
    - Is there enough light? Or too much?
 - 🖼️ Perspective

 We now could improve the image conditions so the image can be easier to read. 
 
 Otherwise we can try to compensate those conditions with the next steps.

 - ☯️ Text constrast with the background
 - 🔤 Language and characters
 - 🖊️ Typography
 - 🤳 Image quality

 Now that we know the conditions of the image we can apply some of the following filters:
 - Binarization
 - Inversion (Negative filter)
 - Dilation
 - Erosion
 - Noise reduction
    - Gaussian Blur
    - Median Blur
    - Bilateral Filtering
 - Transformations
    - Cropping: Manual or with **object detection**
    - Rotation
 - [More filters](https://medium.com/technovators/survey-on-image-preprocessing-techniques-to-improve-ocr-accuracy-616ddb931b76)
 These techniques will help us get a more clear input, reducing the image noise and issolating the characters we want to read.

## Clear the output

If things went right, we should have recieved an output from our image. *But is it what we expected?*

### Confidence

OCR algorithms and libraries usually return a list of characters/words and a cofidence percentaje for each one of those.

We could throw up the results that have a small percentaje of confidence.

### REGEX

[Regular Expressions](https://www.regular-expressions.info/) are a way to find patterns in texts.

This way we could find and/or remove patterns like:
 - Multiple commas: ```/[,{2,}]/``` Matches: *,,* or *,,,,,*
 - Plate formatting: ```/\d{4}\w?[A-Z]{3}/``` Matches: *0123 AAA* or *9999BCD*

## ⌨️ Talk is cheap. Show me the code.

All this theory is useless without applying it to the practice.
So I have prepared a pair of projects to demostrate the capabilities (and limitations) of OCR:

For these two I have used [Tesseract](https://github.com/tesseract-ocr/tesseract)

### Vehicle plate recognition

A small and basic script that detects and reads vehicle plates. (Tested with Spain plates): [Code here](./examples/car_plates/)

If you want to check a more polished product visit 
**[this link](https://platerecognizer.com/)**.

### Realtime text recognition

A webapp that reads from the device's camera in realtime. 
It lets the user configure the filters so the preprocessing can be adjusted to a variety of situations. 

[Try it](https://a-fandino.github.io/OCR-Documentation/) 

[Code here](./examples/id_recognition_web/)


## 📋 Summary

We've learned what is OCR, how can it be used and the uses we can apply to this technology.

- [What is OCR?](#-what-is-ocr)
- [Use cases](#%EF%B8%8F-use-cases)
- [Prepare the images](#-prepare-the-images)
- [Clear the output](#clear-the-output)
- [Talk is cheap. Show me the code.](#%EF%B8%8F-talk-is-cheap-show-me-the-code)

# References
 - https://www.ibm.com/cloud/blog/optical-character-recognition
 - https://en.wikipedia.org/wiki/Optical_character_recognition
 - https://www.necc.mass.edu/wp-content/uploads/accessible-media-necc/uncategorized/resources/What-is-OCR.pdf
 - https://scholar.harvard.edu/lingayas/presentations/optical-character-recognization
 - https://dsp.stackexchange.com/questions/8316/the-difference-between-bilateral-filter-and-gaussian-filter
 - https://dev.to/mathewthe2/using-javascript-to-preprocess-images-for-ocr-1jc
 - https://medium.com/technovators/survey-on-image-preprocessing-techniques-to-improve-ocr-accuracy-616ddb931b76
 - https://programminghistorian.org/en/lessons/cleaning-ocrd-text-with-regular-expressions