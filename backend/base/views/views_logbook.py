# views.py
from django.http import JsonResponse

from ..helper.Race_Filter import get_character_sheet_by_race
from ..helper.Mongo_Client import collection

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


def serialize_doc(doc):
    doc['_id'] = str(doc['_id'])  # Convert ObjectId to string
    return doc


@api_view(['GET'])
def get_all_texts(request):
    docs_cursor = collection.find()
    docs = [serialize_doc(doc) for doc in docs_cursor]
    return JsonResponse(docs, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_text_by_ID(request):
    user = request.user
    race = request.query_params.get("race")
    sheetID = request.query_params.get("id")

    try:
        if not race or not sheetID:
            return Response({"msg": "Race and sheet ID are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the race-specific character sheet
        char_sheet = get_character_sheet_by_race(user, int(race), int(sheetID))

        if not char_sheet:
            return Response({"msg": "Character sheet not found."}, status=status.HTTP_404_NOT_FOUND)

        # Use the sheet's ID (or any specific field) to look up a MongoDB document
        user_id = char_sheet.id

        # Fetch the document from MongoDB
        document = collection.find_one({"user_id": user_id})

        if not document:
            return Response({"msg": "Document not found in MongoDB."}, status=status.HTTP_404_NOT_FOUND)

        return Response(serialize_doc(document), status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error: {e}")
        return Response({"msg": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def Create_LogBook(request):
    user = request.user
    race = request.query_params.get("race")
    sheetID = request.query_params.get("id")
    content = request.data.get('content')

    try:
            if not race or not sheetID:
                return Response({"msg": "Race and sheet ID are required."}, status=status.HTTP_400_BAD_REQUEST)

            # Fetch the race-specific character sheet
            char_sheet = get_character_sheet_by_race(user, int(race), int(sheetID))

            if not char_sheet:
                return Response({"msg": "Character sheet not found."}, status=status.HTTP_404_NOT_FOUND)

            # Use the sheet's ID (or any specific field) to look up a MongoDB document
            user_id = char_sheet.id
            char_name_for_file_name = char_sheet.char_name

            # check if document exists for the user
            document = collection.find_one({"user_id": user_id})
            if not document:
                #create the document
                doc = {
                    "user_id": user_id,
                    "file_name": char_name_for_file_name,
                    "content": content
                }

                collection.insert_one(doc)

                return Response({"msg": "Document created."})

            return Response({"msg": "Document exists already"})
    except Exception as e:
        print(f"Error: {e}")
        return Response({"msg": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_logbook_content(request):
    user = request.user
    race = request.query_params.get("race")
    sheetID = request.query_params.get("id")
    content = request.data.get('content')

    try:
        if not race or not sheetID:
            return Response({"msg": "Race and sheet ID are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the race-specific character sheet
        char_sheet = get_character_sheet_by_race(user, int(race), int(sheetID))
        if not char_sheet:
            return Response({"msg": "Character sheet not found."}, status=status.HTTP_404_NOT_FOUND)

        user_id = char_sheet.id

        # Try to find existing document in MongoDB
        mongo_doc = collection.find_one({"user_id": user_id})

        if mongo_doc:
            # Update the content
            collection.update_one({"user_id": user_id}, {"$set": {"content": content}})
            return Response({"msg": "Logbook content updated."}, status=status.HTTP_200_OK)
        else:
            return Response({"msg": "Document does not exist"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        print(f"Error: {e}")
        return Response({"msg": f"An error occurred: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
