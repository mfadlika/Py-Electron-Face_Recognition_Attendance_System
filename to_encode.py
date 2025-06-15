import os
import pickle
import face_recognition

def encode_faces_from_folder(folder_path, output_file="encodings.pkl"):
    encodings = []
    names = []
    
    # Iterasi melalui semua file gambar di folder
    for filename in os.listdir(folder_path):
        if filename.endswith(('.jpg', '.jpeg', '.png')):
            image_path = os.path.join(folder_path, filename)
            try:
                # Memuat gambar dan ekstrak encoding
                image = face_recognition.load_image_file(image_path)
                face_encoding = face_recognition.face_encodings(image)
                if face_encoding:
                    encodings.append(face_encoding[0])  # Menyimpan encoding wajah pertama
                    names.append(os.path.splitext(filename)[0])  # Menyimpan nama wajah
                    print(f"Encoded: {filename}")
                else:
                    print(f"No face found in {filename}")
            except Exception as e:
                print(f"Error processing {filename}: {e}")
    
    # Menyimpan encoding dan nama ke file menggunakan pickle
    with open(output_file, "wb") as f:
        pickle.dump({"encodings": encodings, "names": names}, f)
    
    print(f"Encodings saved to {output_file}.")

# Contoh penggunaan
folder_path = "database/images"  # Ganti dengan path folder Anda
encode_faces_from_folder(folder_path)