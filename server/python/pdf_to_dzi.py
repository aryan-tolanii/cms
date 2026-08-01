from pathlib import Path
import sys
import json
import fitz
import pyvips

DPI = 600
TILE_SIZE = 256
OVERLAP = 1


def generate_thumbnail(page, output_path: Path):
    """
    Generate a small preview image from the first page.
    """
    thumb_matrix = fitz.Matrix(2, 2)  # ~144 DPI
    pix = page.get_pixmap(matrix=thumb_matrix, alpha=False)

    image = pyvips.Image.new_from_memory(
        pix.samples,
        pix.width,
        pix.height,
        pix.n,
        "uchar",
    )

    image.write_to_file(str(output_path))


def process_pdf(input_pdf: Path, output_dir: Path):
    """
    Converts a single PDF into Deep Zoom (.dzi + tiles).

    Output structure:

    output_dir/
        thumbnail.png
        page_001.dzi
        page_001_files/
        page_002.dzi
        page_002_files/
        ...
    """

    output_dir.mkdir(parents=True, exist_ok=True)

    zoom = DPI / 72
    matrix = fitz.Matrix(zoom, zoom)

    doc = fitz.open(input_pdf)

    if doc.page_count == 0:
        raise Exception("PDF contains no pages.")

    page_info = []

    # Generate thumbnail from first page
    generate_thumbnail(doc[0], output_dir / "thumbnail.png")

    for page_number, page in enumerate(doc, start=1):

        pix = page.get_pixmap(
            matrix=matrix,
            alpha=False,
        )

        image = pyvips.Image.new_from_memory(
            pix.samples,
            pix.width,
            pix.height,
            pix.n,
            "uchar",
        )

        dzi_name = output_dir / f"page_{page_number:03d}"

        image.dzsave(
            str(dzi_name),
            tile_size=TILE_SIZE,
            overlap=OVERLAP,
            suffix=".png",
        )

        page_info.append(
            {
                "pageNumber": page_number,
                "dziPath": f"page_{page_number:03d}.dzi",
            }
        )

    page_count = doc.page_count
    doc.close()

    return {
        "success": True,
        "thumbnail": "thumbnail.png",
        "pageCount": page_count,
        "pages": page_info,
    }


def main():

    if len(sys.argv) != 3:
        print(
            json.dumps(
                {
                    "success": False,
                    "error": "Usage: python pdf_to_dzi.py <input_pdf> <output_directory>",
                }
            )
        )
        sys.exit(1)

    input_pdf = Path(sys.argv[1])
    output_dir = Path(sys.argv[2])

    if not input_pdf.exists():
        print(
            json.dumps(
                {
                    "success": False,
                    "error": f"Input PDF not found: {input_pdf}",
                }
            )
        )
        sys.exit(1)

    try:
        result = process_pdf(input_pdf, output_dir)
        print(json.dumps(result))

    except Exception as e:
        print(
            json.dumps(
                {
                    "success": False,
                    "error": str(e),
                }
            )
        )
        sys.exit(1)


if __name__ == "__main__":
    main()
