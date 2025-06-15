import pickle
import face_recognition
import sys

def load_encodings(file="encodings.pkl"):
    try:
        # Memuat file encoding dari pickle
        with open(file, "rb") as f:
            data = pickle.load(f)
            return data["encodings"], data["names"]
    except FileNotFoundError:
        print(f"File {file} not found.")
        return [], []

def recognize_face_in_image(image_path, known_face_encodings, known_face_names):
    try:
        # Memuat gambar target untuk pengenalan wajah
        image = face_recognition.load_image_file(image_path)
        # Mendeteksi lokasi wajah dan ekstrak encoding
        face_locations = face_recognition.face_locations(image, number_of_times_to_upsample=0, model="hog")
        face_encodings = face_recognition.face_encodings(image, face_locations)
        
        for face_encoding in face_encodings:
            # Mencocokkan encoding wajah dengan wajah yang dikenal
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.5)
            if True in matches:
                # Ambil nama wajah pertama yang cocok dan langsung return
                return known_face_names[matches.index(True)]
        
        return "Unknown"
    except Exception as e:
        print(f"Error during recognition: {e}")
        return "Error"

# Contoh penggunaan
if __name__ == "__main__":
    try:
        image_path = sys.argv[1]  # Path ke gambar target
        encodings_file = "database/encoding/encodings.pkl"  # File yang menyimpan encoding wajah
        known_face_encodings, known_face_names = load_encodings(encodings_file)
     

        if known_face_encodings:
            result = recognize_face_in_image(image_path, known_face_encodings, known_face_names)
            print(result)
        else:
            print("No known face encodings found.")
    except Exception as e:
        print(f"Error: {e}")