SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[DeleteVendorInfoById] --  DeleteVendorInfoById 7
	-- Add the parameters for the stored procedure here
	@VendorId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	delete from VendorInfo where VendorID=@VendorId
END



GO