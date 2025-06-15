import os
import pickle
import face_recognition

def encode_faces_from_folder(folder_path, output_file):
    if os.path.exists(output_file):
        with open(output_file, "rb") as f:
            data = pickle.load(f)
        existing_encodings = data["encodings"]
        existing_names = set(data["names"])  # Menggunakan set untuk pencarian lebih cepat
    else:
        existing_encodings = []
        existing_names = set()
    
    new_encodings = []
    new_names = []
    
    for filename in os.listdir(folder_path):
        if filename.endswith(('.jpg', '.jpeg', '.png')):
            name = os.path.splitext(filename)[0]    
            if name in existing_names:
                print(f"Skipping {filename} (already encoded)")
                continue
            image_path = os.path.join(folder_path, filename)
            try:
                image = face_recognition.load_image_file(image_path)
                face_encoding = face_recognition.face_encodings(image)
                if face_encoding:
                    new_encodings.append(face_encoding[0])  # Menyimpan encoding wajah pertama
                    new_names.append(name)  # Menyimpan nama wajah
                    print(f"Encoded: {filename}")
                else:
                    print(f"No face found in {filename}")
            except Exception as e:
                print(f"Error processing {filename}: {e}")
    
    all_encodings = existing_encodings + new_encodings
    all_names = list(existing_names) + new_names

    # Menyimpan encoding dan nama ke file menggunakan pickle
    with open(output_file, "wb") as f:
        pickle.dump({"encodings": all_encodings, "names": all_names}, f)
    
    print(f"Encodings saved to {output_file}.")

# Contoh penggunaan
folder_path = "database/images"  # Ganti dengan path folder Anda
encode_faces_from_folder(folder_path, "database/encoding/encodings.pkl")