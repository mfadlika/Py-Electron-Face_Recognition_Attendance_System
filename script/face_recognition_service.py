import os
import cv2
import face_recognition
import sys

def load_known_faces(assets_folder):
    known_face_encodings = []
    known_face_names = []

    for filename in os.listdir(assets_folder):
        if filename.endswith(('.jpg', '.jpeg', '.png')):
            image_path = os.path.join(assets_folder, filename)
            
            try:
                known_face_image = face_recognition.load_image_file(image_path)
                face_encoding = face_recognition.face_encodings(known_face_image)
                if face_encoding:
                    known_face_encodings.append(face_encoding[0])
                    known_face_names.append(os.path.splitext(filename)[0])
            except Exception as e:
                print(f"Error processing {image_path}: {e}")
    return known_face_encodings, known_face_names

def recognize_face_in_image(image_path, known_face_encodings, known_face_names):
    try:
        
        image = face_recognition.load_image_file(image_path)
        face_locations = face_recognition.face_locations(image)
        face_encodings = face_recognition.face_encodings(image, face_locations)
        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Unknown"
            if True in matches:
                name = known_face_names[matches.index(True)]
            
            return name
        return "Unknown"
    except Exception as e:
        print(f"Error during recognition: {e}")
        return "Error"

if __name__ == "__main__":
    try:
        image_path = sys.argv[1]
        known_face_folder = sys.argv[2]
        known_face_encodings, known_face_names = load_known_faces(known_face_folder)
        result = recognize_face_in_image(image_path, known_face_encodings, known_face_names)
        print(result)
    except Exception as e:
        print(f"Error: {e}")
