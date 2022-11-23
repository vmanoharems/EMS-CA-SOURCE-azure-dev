SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[InvoiceNumberAutoFill]
(
@CompanyID int,
@Mode int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

if(@Mode=1)
begin
select InvoiceNumber,ProjectCode from PayrollFile where CompanyID=@CompanyID and Status='Load'
end
else
begin
select InvoiceNumber,ProjectCode from PayrollFile where CompanyID=@CompanyID and Status='Post'
end
END



GO