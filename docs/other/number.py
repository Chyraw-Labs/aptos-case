import re
from pathlib import Path

class SVGNumbering:
    def __init__(self, start_number=1):
        # 初始化起始编号
        self.current_number = start_number
    
    def add_number_to_svg(self, input_file, output_file=None):
        """
        向SVG文件添加编号
        :param input_file: 输入SVG文件路径
        :param output_file: 输出SVG文件路径，如果为None则覆盖原文件
        :return: 处理后的SVG内容
        """
        # 如果没有指定输出文件，则覆盖原文件
        if output_file is None:
            output_file = input_file
            
        # 读取SVG文件内容
        with open(input_file, 'r', encoding='utf-8') as f:
            svg_content = f.read()
            
        # 提取SVG的宽度和高度
        width_match = re.search(r'width="([\d.]+)"', svg_content)
        height_match = re.search(r'height="([\d.]+)"', svg_content)
        
        if not width_match or not height_match:
            raise ValueError("无法在SVG中找到宽度或高度属性")
            
        # 创建编号文字元素
        number_text = f'''<text x="130" y="80" font-family="Arial" font-size="48" fill="#000" text-anchor="start">#%d</text>''' % self.current_number
        
        # 在已有的文本元素之前插入新的编号
        pattern = r'(<text[^>]*>#\d+</text>)'
        if re.search(pattern, svg_content):
            # 如果已经存在编号，替换它
            new_content = re.sub(pattern, number_text, svg_content)
        else:
            # 如果不存在编号，添加到第一个路径元素后面
            path_pattern = r'(</path>)'
            new_content = re.sub(path_pattern, r'\1\n' + number_text, svg_content, count=1)
        
        # 写入输出文件
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
        # 增加编号计数
        self.current_number += 1
        
        return new_content

def process_svg_files(input_dir, output_dir=None, start_number=1):
    """
    处理目录中的所有SVG文件
    :param input_dir: 输入目录路径
    :param output_dir: 输出目录路径，如果为None则覆盖原文件
    :param start_number: 起始编号
    """
    # 创建SVG编号处理器
    svg_numbering = SVGNumbering(start_number)
    
    # 获取所有SVG文件
    input_path = Path(input_dir)
    svg_files = list(input_path.glob('*.svg'))
    
    # 创建输出目录（如果指定）
    if output_dir:
        Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    # 处理每个SVG文件
    for svg_file in sorted(svg_files):
        if output_dir:
            output_file = Path(output_dir) / svg_file.name
        else:
            output_file = svg_file
            
        try:
            svg_numbering.add_number_to_svg(str(svg_file), str(output_file))
            print(f"已处理: {svg_file.name} -> #{svg_numbering.current_number - 1}")
        except Exception as e:
            print(f"处理 {svg_file.name} 时出错: {str(e)}")

# 使用示例
if __name__ == "__main__":
    # 处理单个文件
    numbering = SVGNumbering(1)
    numbering.add_number_to_svg("input.svg", "output.svg")