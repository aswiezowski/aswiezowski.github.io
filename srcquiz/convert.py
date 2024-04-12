import re
import json

def markdown_to_json(markdown_text):
    questions = []
    current_question = {}
    current_options = []

    lines = markdown_text.split('\n')
    current_category = None

    for line in lines:
        # Check if line contains a category
        match_category = re.match(r'^([A-Z].*)', line.strip())
        if match_category:
            current_category = match_category.group(1).strip()
        # Check if line is a question
        match_question = re.match(r'^(\d+)\.', line.strip())
        if match_question:
            question_number = int(match_question.group(1))
            if current_question:
                current_question['options'] = current_options
                questions.append(current_question)
                current_options = []
            current_question = {'number': question_number, 'category': current_category, 'question': line[match_question.end():].strip()}
        # Check if line is an option
        elif re.match(r'^\s{2}[a-zA-Z]\.', line):
            option_text = line[line.index('.')+2:].strip()
            correct = False
            if '**' in option_text:
                correct = True
                option_text = option_text.replace('**', '')
            current_options.append({'text': option_text, 'correct': correct})

    if current_question:
        current_question['options'] = current_options
        questions.append(current_question)

    return questions

def load_markdown_from_file(file_path):
    with open(file_path, 'r') as file:
        markdown_text = file.read()
    return markdown_text

def save_json_to_file(json_data, file_path):
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(json_data, file, ensure_ascii=False, indent=2)

# Example usage
file_path = 'src_questions.txt'
output_json_path = 'questions.json'

markdown_text = load_markdown_from_file(file_path)
json_data = markdown_to_json(markdown_text)
save_json_to_file(json_data, output_json_path)
