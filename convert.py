import re
import json

def markdown_to_json(markdown_text):
    questions = []
    current_question = {}
    current_options = []

    lines = markdown_text.split('\n')

    for line in lines:
        # Check if line is a question
        if re.match(r'^\d+\.', line):
            if current_question:
                current_question['options'] = current_options
                questions.append(current_question)
                current_options = []
            current_question = {'question': line[line.index('.')+2:].strip()}
        # Check if line is an option
        elif re.match(r'^  [a-zA-Z]\.', line):
            option_text = line[line.index('.')+2:].strip()
            correct = False
            if '**' in option_text:
                correct = True
                option_text = option_text.replace('**', '')
            current_options.append({'text': option_text, 'correct': correct})

    if current_question:
        current_question['options'] = current_options
        questions.append(current_question)

    return json.dumps(questions, indent=2)

def load_markdown_from_file(file_path):
    with open(file_path, 'r') as file:
        markdown_text = file.read()
    return markdown_text

# Example usage
file_path = 'src_questions.txt'
markdown_text = load_markdown_from_file(file_path)
json_output = markdown_to_json(markdown_text)
print(json_output)
